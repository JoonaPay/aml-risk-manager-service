import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RiskProfile, RiskLevel, RiskFactors, TransactionBehavior, RiskAlert, AlertType } from '../entities/risk-profile.entity';
import { MLRiskScoringService, MLPredictionRequest } from './ml-risk-scoring.service';
import { AlertManagementService } from './alert-management.service';

export interface RiskAssessmentRequest {
  entityId: string;
  entityType: 'individual' | 'business';
  transactionData?: {
    amount: number;
    currency: string;
    frequency: number;
    geographicData: {
      sourceCountry: string;
      destinationCountry: string;
      distance: number;
    };
    timeData: {
      timestamp: Date;
      timeOfDay: number;
      dayOfWeek: number;
      isWeekend: boolean;
      isHoliday: boolean;
    };
    counterpartyData: {
      newCounterparty: boolean;
      counterpartyRiskLevel: string;
      totalCounterparties: number;
    };
  };
  entityData: {
    kycLevel: number;
    accountAge: number;
    industryCode?: string;
    jurisdictionCode: string;
    sanctionsStatus: boolean;
    pepStatus: boolean;
    adverseMediaCount: number;
  };
  complianceData: {
    previousViolations: number;
    currentAlerts: number;
    riskRating: number;
  };
  historicalData: {
    totalTransactions: number;
    totalVolume: number;
    averageTransactionAmount: number;
    baselineFrequency: number;
    typicalTimePatterns: number[];
    usualCounterparties: number;
    seasonalPatterns: Record<string, number>;
  };
}

export interface RiskAssessmentResult {
  entityId: string;
  riskProfile: RiskProfile;
  newAlerts: RiskAlert[];
  recommendations: {
    action: 'monitor' | 'review' | 'enhance_due_diligence' | 'restrict' | 'block';
    priority: 'low' | 'medium' | 'high' | 'critical';
    reasoning: string;
    suggestedControls: string[];
  };
  mlInsights: {
    riskScore: number;
    confidence: number;
    keyFactors: string[];
    anomalies: string[];
  };
}

@Injectable()
export class RiskAssessmentService {
  private readonly logger = new Logger(RiskAssessmentService.name);

  constructor(
    private readonly mlRiskScoringService: MLRiskScoringService,
    private readonly alertManagementService: AlertManagementService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async assessRisk(request: RiskAssessmentRequest): Promise<RiskAssessmentResult> {
    try {
      this.logger.log(`Starting risk assessment for entity: ${request.entityId}`);

      // Step 1: Calculate traditional risk factors
      const riskFactors = await this.calculateRiskFactors(request);

      // Step 2: Get ML risk scoring
      const mlPrediction = await this.getMLRiskScoring(request);

      // Step 3: Detect anomalies
      const anomalies = await this.detectAnomalies(request);

      // Step 4: Calculate overall risk score
      const overallRiskScore = this.calculateOverallRiskScore(riskFactors, mlPrediction.riskScore, anomalies);

      // Step 5: Update transaction behavior
      const transactionBehavior = this.analyzeTransactionBehavior(request);

      // Step 6: Create or update risk profile
      const riskProfile = this.createRiskProfile(request, overallRiskScore, riskFactors, transactionBehavior, mlPrediction);

      // Step 7: Generate alerts if needed
      const newAlerts = await this.generateAlerts(request, riskProfile, anomalies, mlPrediction);

      // Step 8: Generate recommendations
      const recommendations = this.generateRecommendations(riskProfile, newAlerts, mlPrediction);

      // Step 9: Emit events
      this.emitRiskAssessmentEvents(riskProfile, newAlerts);

      const result: RiskAssessmentResult = {
        entityId: request.entityId,
        riskProfile,
        newAlerts,
        recommendations,
        mlInsights: {
          riskScore: mlPrediction.riskScore,
          confidence: mlPrediction.confidence,
          keyFactors: mlPrediction.explainability.topFeatures.map(f => f.feature),
          anomalies: anomalies.anomalyType,
        },
      };

      this.logger.log(`✅ Risk assessment completed for entity: ${request.entityId}, risk level: ${riskProfile.riskLevel}`);
      return result;

    } catch (error) {
      this.logger.error(`❌ Risk assessment failed for entity ${request.entityId}:`, error);
      throw error;
    }
  }

  async reassessEntity(entityId: string): Promise<RiskAssessmentResult> {
    // This would typically fetch current entity data and perform a fresh assessment
    // For now, implementing a simplified version
    
    const mockRequest: RiskAssessmentRequest = {
      entityId,
      entityType: 'individual', // Would be fetched from database
      entityData: {
        kycLevel: 2,
        accountAge: 365,
        jurisdictionCode: 'US',
        sanctionsStatus: false,
        pepStatus: false,
        adverseMediaCount: 0,
      },
      complianceData: {
        previousViolations: 0,
        currentAlerts: 0,
        riskRating: 0.3,
      },
      historicalData: {
        totalTransactions: 100,
        totalVolume: 50000,
        averageTransactionAmount: 500,
        baselineFrequency: 10,
        typicalTimePatterns: [9, 12, 15],
        usualCounterparties: 20,
        seasonalPatterns: {},
      },
    };

    return this.assessRisk(mockRequest);
  }

  private async calculateRiskFactors(request: RiskAssessmentRequest): Promise<RiskFactors> {
    return {
      geographicRisk: this.calculateGeographicRisk(request),
      transactionPatternRisk: this.calculateTransactionPatternRisk(request),
      velocityRisk: this.calculateVelocityRisk(request),
      sanctionsRisk: request.entityData.sanctionsStatus ? 1.0 : 0.0,
      pepRisk: request.entityData.pepStatus ? 0.8 : 0.0,
      adverseMediaRisk: Math.min(request.entityData.adverseMediaCount * 0.1, 1.0),
      industryRisk: this.calculateIndustryRisk(request),
      channelRisk: 0.2, // Default channel risk
      behavioralRisk: this.calculateBehavioralRisk(request),
    };
  }

  private calculateGeographicRisk(request: RiskAssessmentRequest): number {
    const highRiskCountries = ['AF', 'IR', 'KP', 'SY', 'VE', 'MM', 'BY', 'RU'];
    const mediumRiskCountries = ['CN', 'PK', 'BD', 'EG', 'LB', 'TR'];

    let risk = 0;

    // Entity jurisdiction risk
    if (highRiskCountries.includes(request.entityData.jurisdictionCode)) {
      risk += 0.8;
    } else if (mediumRiskCountries.includes(request.entityData.jurisdictionCode)) {
      risk += 0.4;
    }

    // Transaction geographic risk
    if (request.transactionData?.geographicData) {
      const { sourceCountry, destinationCountry } = request.transactionData.geographicData;
      
      if (highRiskCountries.includes(sourceCountry) || highRiskCountries.includes(destinationCountry)) {
        risk += 0.6;
      } else if (mediumRiskCountries.includes(sourceCountry) || mediumRiskCountries.includes(destinationCountry)) {
        risk += 0.3;
      }

      // Cross-border transaction additional risk
      if (sourceCountry !== destinationCountry) {
        risk += 0.1;
      }
    }

    return Math.min(risk, 1.0);
  }

  private calculateTransactionPatternRisk(request: RiskAssessmentRequest): number {
    if (!request.transactionData) return 0;

    let risk = 0;
    const { amount, frequency } = request.transactionData;
    const { averageTransactionAmount, baselineFrequency } = request.historicalData;

    // Amount deviation risk
    const amountDeviation = Math.abs(amount - averageTransactionAmount) / Math.max(averageTransactionAmount, 1);
    if (amountDeviation > 2) risk += 0.4;
    else if (amountDeviation > 1) risk += 0.2;

    // Frequency deviation risk
    const frequencyDeviation = Math.abs(frequency - baselineFrequency) / Math.max(baselineFrequency, 1);
    if (frequencyDeviation > 2) risk += 0.4;
    else if (frequencyDeviation > 1) risk += 0.2;

    // Round amount pattern
    if (this.isRoundAmount(amount)) risk += 0.1;

    // High value transaction
    if (amount > 10000) risk += 0.2;

    return Math.min(risk, 1.0);
  }

  private calculateVelocityRisk(request: RiskAssessmentRequest): number {
    if (!request.transactionData) return 0;

    const { frequency } = request.transactionData;
    const { baselineFrequency } = request.historicalData;

    const velocityRatio = frequency / Math.max(baselineFrequency, 1);
    
    if (velocityRatio > 5) return 0.9;
    if (velocityRatio > 3) return 0.6;
    if (velocityRatio > 2) return 0.3;
    
    return 0;
  }

  private calculateIndustryRisk(request: RiskAssessmentRequest): number {
    const highRiskIndustries = ['money_services', 'gambling', 'crypto', 'precious_metals', 'art_antiques'];
    const mediumRiskIndustries = ['real_estate', 'luxury_goods', 'import_export', 'cash_intensive'];

    if (!request.entityData.industryCode) return 0.3; // Default risk for unknown industry

    if (highRiskIndustries.includes(request.entityData.industryCode)) return 0.8;
    if (mediumRiskIndustries.includes(request.entityData.industryCode)) return 0.5;
    
    return 0.2;
  }

  private calculateBehavioralRisk(request: RiskAssessmentRequest): number {
    let risk = 0;

    // Account age risk (newer accounts are riskier)
    const accountAgeRisk = Math.max(0, (365 - request.entityData.accountAge) / 365 * 0.3);
    risk += accountAgeRisk;

    // KYC level risk (lower KYC levels are riskier)
    const kycRisk = Math.max(0, (3 - request.entityData.kycLevel) / 3 * 0.4);
    risk += kycRisk;

    // Previous violations
    const violationRisk = Math.min(request.complianceData.previousViolations * 0.2, 0.8);
    risk += violationRisk;

    return Math.min(risk, 1.0);
  }

  private async getMLRiskScoring(request: RiskAssessmentRequest): Promise<any> {
    const mlRequest: MLPredictionRequest = {
      entityId: request.entityId,
      entityType: request.entityType,
      transactionFeatures: request.transactionData ? {
        amount: request.transactionData.amount,
        frequency: request.transactionData.frequency,
        timeOfDay: request.transactionData.timeData.timeOfDay,
        dayOfWeek: request.transactionData.timeData.dayOfWeek,
        isWeekend: request.transactionData.timeData.isWeekend,
        isHoliday: request.transactionData.timeData.isHoliday,
        geographicDistance: request.transactionData.geographicData.distance,
        counterpartyCount: request.transactionData.counterpartyData.totalCounterparties,
        accountAge: request.entityData.accountAge,
        averageBalance: request.historicalData.totalVolume / Math.max(request.historicalData.totalTransactions, 1),
        velocityRatio: request.transactionData.frequency / Math.max(request.historicalData.baselineFrequency, 1),
        roundAmountIndicator: this.isRoundAmount(request.transactionData.amount),
        crossBorderIndicator: request.transactionData.geographicData.sourceCountry !== request.transactionData.geographicData.destinationCountry,
        highRiskCountryIndicator: this.isHighRiskCountry(request.transactionData.geographicData.destinationCountry),
        cashIntensiveIndicator: this.isCashIntensive(request.entityData.industryCode),
      } : undefined,
      entityFeatures: {
        entityAge: request.entityData.accountAge,
        kycLevel: request.entityData.kycLevel,
        riskAssessmentScore: request.complianceData.riskRating,
        sanctionsMatches: request.entityData.sanctionsStatus ? 1 : 0,
        pepIndicator: request.entityData.pepStatus,
        adverseMediaCount: request.entityData.adverseMediaCount,
        transactionCount: request.historicalData.totalTransactions,
        totalVolume: request.historicalData.totalVolume,
        industryRiskScore: this.calculateIndustryRisk(request),
        jurisdictionRiskScore: this.calculateGeographicRisk(request),
      },
      historicalBehavior: {
        baselineTransactionAmount: request.historicalData.averageTransactionAmount,
        baselineFrequency: request.historicalData.baselineFrequency,
        typicalTimePatterns: request.historicalData.typicalTimePatterns,
        usualCounterparties: request.historicalData.usualCounterparties,
      },
    };

    return this.mlRiskScoringService.scoreTransaction(mlRequest);
  }

  private async detectAnomalies(request: RiskAssessmentRequest): Promise<any> {
    const mlRequest: MLPredictionRequest = {
      entityId: request.entityId,
      entityType: request.entityType,
      transactionFeatures: request.transactionData ? {
        amount: request.transactionData.amount,
        frequency: request.transactionData.frequency,
        timeOfDay: request.transactionData.timeData.timeOfDay,
        dayOfWeek: request.transactionData.timeData.dayOfWeek,
        isWeekend: request.transactionData.timeData.isWeekend,
        isHoliday: request.transactionData.timeData.isHoliday,
        geographicDistance: request.transactionData.geographicData.distance,
        counterpartyCount: request.transactionData.counterpartyData.totalCounterparties,
        accountAge: request.entityData.accountAge,
        averageBalance: 0,
        velocityRatio: 0,
        roundAmountIndicator: false,
        crossBorderIndicator: false,
        highRiskCountryIndicator: false,
        cashIntensiveIndicator: false,
      } : undefined,
      entityFeatures: {
        entityAge: request.entityData.accountAge,
        kycLevel: request.entityData.kycLevel,
        riskAssessmentScore: request.complianceData.riskRating,
        sanctionsMatches: 0,
        pepIndicator: request.entityData.pepStatus,
        adverseMediaCount: request.entityData.adverseMediaCount,
        transactionCount: request.historicalData.totalTransactions,
        totalVolume: request.historicalData.totalVolume,
        industryRiskScore: 0,
        jurisdictionRiskScore: 0,
      },
      historicalBehavior: {
        baselineTransactionAmount: request.historicalData.averageTransactionAmount,
        baselineFrequency: request.historicalData.baselineFrequency,
        typicalTimePatterns: request.historicalData.typicalTimePatterns,
        usualCounterparties: request.historicalData.usualCounterparties,
      },
    };

    return this.mlRiskScoringService.detectAnomalies(mlRequest);
  }

  private calculateOverallRiskScore(riskFactors: RiskFactors, mlScore: number, anomalies: any): number {
    // Weighted combination of traditional and ML scores
    const traditionalScore = (
      riskFactors.geographicRisk * 0.15 +
      riskFactors.transactionPatternRisk * 0.20 +
      riskFactors.velocityRisk * 0.15 +
      riskFactors.sanctionsRisk * 0.25 +
      riskFactors.pepRisk * 0.10 +
      riskFactors.adverseMediaRisk * 0.05 +
      riskFactors.industryRisk * 0.05 +
      riskFactors.behavioralRisk * 0.05
    );

    // Combine traditional and ML scores
    let combinedScore = (traditionalScore * 0.4) + (mlScore * 0.6);

    // Anomaly boost
    if (anomalies.isAnomaly) {
      combinedScore = Math.min(combinedScore + (anomalies.anomalyScore * 0.2), 1.0);
    }

    return Math.min(Math.max(combinedScore, 0), 1);
  }

  private analyzeTransactionBehavior(request: RiskAssessmentRequest): TransactionBehavior {
    return {
      averageTransactionAmount: request.historicalData.averageTransactionAmount,
      transactionFrequency: request.historicalData.baselineFrequency,
      preferredTimeOfDay: request.historicalData.typicalTimePatterns.map(t => `${t}:00`),
      preferredDaysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], // Mock data
      geographicPatterns: [request.entityData.jurisdictionCode],
      counterpartyPatterns: [`${request.historicalData.usualCounterparties} usual counterparties`],
      seasonalPatterns: request.historicalData.seasonalPatterns,
    };
  }

  private createRiskProfile(
    request: RiskAssessmentRequest,
    overallRiskScore: number,
    riskFactors: RiskFactors,
    transactionBehavior: TransactionBehavior,
    mlPrediction: any
  ): RiskProfile {
    const riskLevel = this.mapScoreToRiskLevel(overallRiskScore);
    
    return new RiskProfile(
      `risk_profile_${request.entityId}`,
      request.entityId,
      request.entityType,
      riskLevel,
      overallRiskScore,
      riskFactors,
      transactionBehavior,
      this.mlRiskScoringService.generateMLRiskScoring(mlPrediction),
      new Date(),
      this.calculateNextReviewDate(riskLevel),
    );
  }

  private async generateAlerts(
    request: RiskAssessmentRequest,
    riskProfile: RiskProfile,
    anomalies: any,
    mlPrediction: any
  ): Promise<RiskAlert[]> {
    const alerts: RiskAlert[] = [];

    // High risk score alert
    if (riskProfile.overallRiskScore >= 0.7) {
      alerts.push(await this.alertManagementService.createAlert({
        entityId: request.entityId,
        entityType: request.entityType,
        alertType: AlertType.HIGH_VELOCITY_TRANSACTIONS,
        severity: riskProfile.riskLevel,
        description: 'High overall risk score detected',
        details: {
          riskScore: riskProfile.overallRiskScore,
          riskLevel: riskProfile.riskLevel,
          keyFactors: Object.entries(riskProfile.riskFactors)
            .filter(([_, value]) => value > 0.5)
            .map(([key, _]) => key),
        },
        triggeredBy: {
          ruleName: 'High Risk Score Rule',
          threshold: 0.7,
          actualValue: riskProfile.overallRiskScore,
        },
      }));
    }

    // Anomaly alerts
    if (anomalies.isAnomaly) {
      alerts.push(await this.alertManagementService.createAlert({
        entityId: request.entityId,
        entityType: request.entityType,
        alertType: AlertType.UNUSUAL_TRANSACTION_PATTERN,
        severity: anomalies.anomalyScore > 0.8 ? RiskLevel.HIGH : RiskLevel.MEDIUM,
        description: `Anomalous behavior detected: ${anomalies.explanation}`,
        details: {
          anomalyScore: anomalies.anomalyScore,
          anomalyTypes: anomalies.anomalyType,
          explanation: anomalies.explanation,
        },
        triggeredBy: {
          mlModel: 'anomaly_detection_v1',
          threshold: 0.5,
          actualValue: anomalies.anomalyScore,
        },
      }));
    }

    // ML-based alerts
    for (const alertRec of mlPrediction.alertRecommendations) {
      if (alertRec.probability > 0.6) {
        alerts.push(await this.alertManagementService.createAlert({
          entityId: request.entityId,
          entityType: request.entityType,
          alertType: alertRec.alertType as AlertType,
          severity: alertRec.probability > 0.8 ? RiskLevel.HIGH : RiskLevel.MEDIUM,
          description: alertRec.reasoning,
          details: {
            mlProbability: alertRec.probability,
            mlRecommendation: alertRec,
          },
          triggeredBy: {
            mlModel: mlPrediction.modelVersion,
            threshold: 0.6,
            actualValue: alertRec.probability,
          },
        }));
      }
    }

    return alerts;
  }

  private generateRecommendations(riskProfile: RiskProfile, alerts: RiskAlert[], mlPrediction: any): any {
    const riskScore = riskProfile.overallRiskScore;
    const hasHighSeverityAlerts = alerts.some(alert => 
      alert.severity === RiskLevel.HIGH || alert.severity === RiskLevel.VERY_HIGH
    );

    if (riskScore >= 0.8 || hasHighSeverityAlerts) {
      return {
        action: 'block',
        priority: 'critical',
        reasoning: 'Critical risk level detected with high severity alerts',
        suggestedControls: [
          'Immediate transaction restriction',
          'Enhanced due diligence review',
          'Management escalation',
          'Regulatory notification if required',
        ],
      };
    }

    if (riskScore >= 0.6) {
      return {
        action: 'enhance_due_diligence',
        priority: 'high',
        reasoning: 'High risk profile requires enhanced monitoring',
        suggestedControls: [
          'Enhanced due diligence procedures',
          'Increased transaction monitoring',
          'Regular risk assessment reviews',
          'Additional documentation requirements',
        ],
      };
    }

    if (riskScore >= 0.4 || alerts.length > 0) {
      return {
        action: 'review',
        priority: 'medium',
        reasoning: 'Medium risk profile requires periodic review',
        suggestedControls: [
          'Periodic risk assessment',
          'Standard monitoring procedures',
          'Alert investigation',
        ],
      };
    }

    return {
      action: 'monitor',
      priority: 'low',
      reasoning: 'Low risk profile with standard monitoring',
      suggestedControls: [
        'Standard monitoring procedures',
        'Periodic risk review',
      ],
    };
  }

  private emitRiskAssessmentEvents(riskProfile: RiskProfile, alerts: RiskAlert[]): void {
    this.eventEmitter.emit('risk.assessment.completed', {
      entityId: riskProfile.entityId,
      riskLevel: riskProfile.riskLevel,
      riskScore: riskProfile.overallRiskScore,
      alertsGenerated: alerts.length,
    });

    if (riskProfile.isHighRisk()) {
      this.eventEmitter.emit('risk.high_risk_detected', {
        entityId: riskProfile.entityId,
        riskLevel: riskProfile.riskLevel,
        riskScore: riskProfile.overallRiskScore,
      });
    }

    for (const alert of alerts) {
      this.eventEmitter.emit('alert.created', alert);
    }
  }

  private mapScoreToRiskLevel(score: number): RiskLevel {
    if (score >= 0.9) return RiskLevel.CRITICAL;
    if (score >= 0.75) return RiskLevel.VERY_HIGH;
    if (score >= 0.6) return RiskLevel.HIGH;
    if (score >= 0.4) return RiskLevel.MEDIUM;
    if (score >= 0.2) return RiskLevel.LOW;
    return RiskLevel.VERY_LOW;
  }

  private calculateNextReviewDate(riskLevel: RiskLevel): Date {
    const today = new Date();
    let daysToAdd = 90; // Default quarterly review

    switch (riskLevel) {
      case RiskLevel.CRITICAL:
        daysToAdd = 7; // Weekly
        break;
      case RiskLevel.VERY_HIGH:
        daysToAdd = 14; // Bi-weekly
        break;
      case RiskLevel.HIGH:
        daysToAdd = 30; // Monthly
        break;
      case RiskLevel.MEDIUM:
        daysToAdd = 60; // Bi-monthly
        break;
      default:
        daysToAdd = 90; // Quarterly
    }

    return new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
  }

  private isRoundAmount(amount: number): boolean {
    const amountStr = amount.toString();
    return /00$/.test(amountStr) && amount >= 100;
  }

  private isHighRiskCountry(countryCode: string): boolean {
    const highRiskCountries = ['AF', 'IR', 'KP', 'SY', 'VE', 'MM', 'BY', 'RU'];
    return highRiskCountries.includes(countryCode);
  }

  private isCashIntensive(industryCode?: string): boolean {
    const cashIntensiveIndustries = ['money_services', 'gambling', 'retail_cash', 'hospitality'];
    return industryCode ? cashIntensiveIndustries.includes(industryCode) : false;
  }
}