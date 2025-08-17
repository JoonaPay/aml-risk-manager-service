import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MLRiskScoring, RiskFactors } from '../entities/risk-profile.entity';

export interface TransactionFeatures {
  amount: number;
  frequency: number;
  timeOfDay: number;
  dayOfWeek: number;
  isWeekend: boolean;
  isHoliday: boolean;
  geographicDistance: number;
  counterpartyCount: number;
  accountAge: number;
  averageBalance: number;
  velocityRatio: number;
  roundAmountIndicator: boolean;
  crossBorderIndicator: boolean;
  highRiskCountryIndicator: boolean;
  cashIntensiveIndicator: boolean;
}

export interface EntityFeatures {
  entityAge: number;
  kycLevel: number;
  riskAssessmentScore: number;
  sanctionsMatches: number;
  pepIndicator: boolean;
  adverseMediaCount: number;
  transactionCount: number;
  totalVolume: number;
  industryRiskScore: number;
  jurisdictionRiskScore: number;
}

export interface MLPredictionRequest {
  entityId: string;
  entityType: 'individual' | 'business';
  transactionFeatures?: TransactionFeatures;
  entityFeatures: EntityFeatures;
  historicalBehavior: {
    baselineTransactionAmount: number;
    baselineFrequency: number;
    typicalTimePatterns: number[];
    usualCounterparties: number;
  };
}

export interface MLPredictionResponse {
  entityId: string;
  riskScore: number;
  confidence: number;
  modelVersion: string;
  prediction: 'low_risk' | 'medium_risk' | 'high_risk' | 'critical_risk';
  features: Record<string, number>;
  explainability: {
    topFeatures: Array<{
      feature: string;
      importance: number;
      value: number;
      impact: 'positive' | 'negative';
    }>;
  };
  alertRecommendations: Array<{
    alertType: string;
    probability: number;
    reasoning: string;
  }>;
}

@Injectable()
export class MLRiskScoringService {
  private readonly logger = new Logger(MLRiskScoringService.name);
  private readonly mlApiUrl: string;
  private readonly mlApiKey: string;
  private readonly enabled: boolean;
  
  // Model configurations
  private readonly transactionModel = 'transaction_risk_v3';
  private readonly entityModel = 'entity_risk_v2';
  private readonly anomalyModel = 'anomaly_detection_v1';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.mlApiUrl = this.configService.get<string>('ml.apiUrl', 'http://localhost:8000');
    this.mlApiKey = this.configService.get<string>('ml.apiKey', '');
    this.enabled = this.configService.get<boolean>('ml.enabled', false);
  }

  async scoreTransaction(request: MLPredictionRequest): Promise<MLPredictionResponse> {
    try {
      if (!this.enabled) {
        this.logger.warn('ML scoring is disabled, returning mock response');
        return this.getMockTransactionScore(request);
      }

      this.logger.log(`Scoring transaction risk for entity: ${request.entityId}`);

      const features = this.preprocessFeatures(request);
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.mlApiUrl}/api/v1/score/transaction`,
          {
            model: this.transactionModel,
            features,
            entityId: request.entityId,
            entityType: request.entityType,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.mlApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return this.mapMLResponse(response.data, request.entityId);

    } catch (error) {
      this.logger.error(`ML transaction scoring failed for entity ${request.entityId}:`, error);
      return this.getMockTransactionScore(request);
    }
  }

  async scoreEntity(request: MLPredictionRequest): Promise<MLPredictionResponse> {
    try {
      if (!this.enabled) {
        return this.getMockEntityScore(request);
      }

      this.logger.log(`Scoring entity risk for: ${request.entityId}`);

      const features = this.preprocessEntityFeatures(request);
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.mlApiUrl}/api/v1/score/entity`,
          {
            model: this.entityModel,
            features,
            entityId: request.entityId,
            entityType: request.entityType,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.mlApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return this.mapMLResponse(response.data, request.entityId);

    } catch (error) {
      this.logger.error(`ML entity scoring failed for entity ${request.entityId}:`, error);
      return this.getMockEntityScore(request);
    }
  }

  async detectAnomalies(request: MLPredictionRequest): Promise<{
    isAnomaly: boolean;
    anomalyScore: number;
    anomalyType: string[];
    explanation: string;
  }> {
    try {
      if (!this.enabled) {
        return this.getMockAnomalyDetection(request);
      }

      this.logger.log(`Detecting anomalies for entity: ${request.entityId}`);

      const features = this.preprocessAnomalyFeatures(request);
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.mlApiUrl}/api/v1/detect/anomaly`,
          {
            model: this.anomalyModel,
            features,
            entityId: request.entityId,
            baseline: request.historicalBehavior,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.mlApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data;

    } catch (error) {
      this.logger.error(`Anomaly detection failed for entity ${request.entityId}:`, error);
      return this.getMockAnomalyDetection(request);
    }
  }

  async updateMLModel(modelName: string, trainingData: any[]): Promise<boolean> {
    try {
      if (!this.enabled) {
        return true;
      }

      this.logger.log(`Updating ML model: ${modelName}`);

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.mlApiUrl}/api/v1/models/${modelName}/retrain`,
          {
            data: trainingData,
            validation_split: 0.2,
            epochs: 100,
            batch_size: 32,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.mlApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.status === 200;

    } catch (error) {
      this.logger.error(`Failed to update ML model ${modelName}:`, error);
      return false;
    }
  }

  async getModelPerformance(modelName: string): Promise<any> {
    try {
      if (!this.enabled) {
        return this.getMockModelPerformance(modelName);
      }

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.mlApiUrl}/api/v1/models/${modelName}/performance`,
          {
            headers: {
              'Authorization': `Bearer ${this.mlApiKey}`,
            },
          },
        ),
      );

      return response.data;

    } catch (error) {
      this.logger.error(`Failed to get model performance for ${modelName}:`, error);
      return this.getMockModelPerformance(modelName);
    }
  }

  generateMLRiskScoring(prediction: MLPredictionResponse): MLRiskScoring {
    return {
      modelVersion: prediction.modelVersion,
      features: prediction.features,
      prediction: prediction.riskScore,
      confidence: prediction.confidence,
      explainability: {
        topFeatures: prediction.explainability.topFeatures.map(f => ({
          feature: f.feature,
          importance: f.importance,
          value: f.value,
        })),
      },
      lastUpdated: new Date(),
    };
  }

  private preprocessFeatures(request: MLPredictionRequest): Record<string, number> {
    const features: Record<string, number> = {};
    
    if (request.transactionFeatures) {
      Object.entries(request.transactionFeatures).forEach(([key, value]) => {
        features[key] = typeof value === 'boolean' ? (value ? 1 : 0) : Number(value);
      });
    }

    // Add derived features
    features.velocity_deviation = this.calculateVelocityDeviation(request);
    features.amount_deviation = this.calculateAmountDeviation(request);
    features.time_pattern_anomaly = this.calculateTimePatternAnomaly(request);
    
    return features;
  }

  private preprocessEntityFeatures(request: MLPredictionRequest): Record<string, number> {
    const features: Record<string, number> = {};
    
    Object.entries(request.entityFeatures).forEach(([key, value]) => {
      features[key] = typeof value === 'boolean' ? (value ? 1 : 0) : Number(value);
    });

    // Add composite features
    features.transaction_intensity = request.entityFeatures.transactionCount / Math.max(request.entityFeatures.entityAge, 1);
    features.average_transaction_size = request.entityFeatures.totalVolume / Math.max(request.entityFeatures.transactionCount, 1);
    
    return features;
  }

  private preprocessAnomalyFeatures(request: MLPredictionRequest): Record<string, number> {
    const features = this.preprocessFeatures(request);
    
    // Add anomaly-specific features
    if (request.transactionFeatures) {
      features.amount_zscore = this.calculateZScore(
        request.transactionFeatures.amount,
        request.historicalBehavior.baselineTransactionAmount,
        request.historicalBehavior.baselineTransactionAmount * 0.3
      );
      
      features.frequency_zscore = this.calculateZScore(
        request.transactionFeatures.frequency,
        request.historicalBehavior.baselineFrequency,
        request.historicalBehavior.baselineFrequency * 0.2
      );
    }
    
    return features;
  }

  private calculateVelocityDeviation(request: MLPredictionRequest): number {
    if (!request.transactionFeatures) return 0;
    
    const current = request.transactionFeatures.frequency;
    const baseline = request.historicalBehavior.baselineFrequency;
    
    return Math.abs(current - baseline) / Math.max(baseline, 1);
  }

  private calculateAmountDeviation(request: MLPredictionRequest): number {
    if (!request.transactionFeatures) return 0;
    
    const current = request.transactionFeatures.amount;
    const baseline = request.historicalBehavior.baselineTransactionAmount;
    
    return Math.abs(current - baseline) / Math.max(baseline, 1);
  }

  private calculateTimePatternAnomaly(request: MLPredictionRequest): number {
    if (!request.transactionFeatures) return 0;
    
    const currentTime = request.transactionFeatures.timeOfDay;
    const typicalPatterns = request.historicalBehavior.typicalTimePatterns;
    
    // Simple distance from typical patterns
    const distances = typicalPatterns.map(pattern => Math.abs(currentTime - pattern));
    return Math.min(...distances) / 24; // Normalize by 24 hours
  }

  private calculateZScore(value: number, mean: number, stdDev: number): number {
    return stdDev > 0 ? (value - mean) / stdDev : 0;
  }

  private mapMLResponse(mlData: any, entityId: string): MLPredictionResponse {
    return {
      entityId,
      riskScore: mlData.risk_score || mlData.prediction,
      confidence: mlData.confidence,
      modelVersion: mlData.model_version || 'v1.0',
      prediction: this.mapRiskLevel(mlData.risk_score || mlData.prediction),
      features: mlData.features || {},
      explainability: {
        topFeatures: (mlData.feature_importance || []).map((item: any) => ({
          feature: item.feature || item.name,
          importance: item.importance || item.weight,
          value: item.value,
          impact: item.importance > 0 ? 'positive' : 'negative',
        })),
      },
      alertRecommendations: mlData.alerts || [],
    };
  }

  private mapRiskLevel(score: number): 'low_risk' | 'medium_risk' | 'high_risk' | 'critical_risk' {
    if (score >= 0.8) return 'critical_risk';
    if (score >= 0.6) return 'high_risk';
    if (score >= 0.4) return 'medium_risk';
    return 'low_risk';
  }

  private getMockTransactionScore(request: MLPredictionRequest): MLPredictionResponse {
    const mockScore = 0.3 + Math.random() * 0.4; // Random score between 0.3-0.7
    
    return {
      entityId: request.entityId,
      riskScore: mockScore,
      confidence: 0.85,
      modelVersion: 'mock_v1.0',
      prediction: this.mapRiskLevel(mockScore),
      features: {
        amount_feature: request.transactionFeatures?.amount || 0,
        frequency_feature: request.transactionFeatures?.frequency || 0,
        velocity_feature: request.transactionFeatures?.velocityRatio || 0,
      },
      explainability: {
        topFeatures: [
          { feature: 'transaction_amount', importance: 0.3, value: request.transactionFeatures?.amount || 0, impact: 'positive' },
          { feature: 'velocity_ratio', importance: 0.25, value: request.transactionFeatures?.velocityRatio || 0, impact: 'positive' },
          { feature: 'geographic_distance', importance: 0.2, value: request.transactionFeatures?.geographicDistance || 0, impact: 'negative' },
        ],
      },
      alertRecommendations: [],
    };
  }

  private getMockEntityScore(request: MLPredictionRequest): MLPredictionResponse {
    const mockScore = 0.2 + Math.random() * 0.3; // Generally lower risk for entity scoring
    
    return {
      entityId: request.entityId,
      riskScore: mockScore,
      confidence: 0.90,
      modelVersion: 'entity_mock_v1.0',
      prediction: this.mapRiskLevel(mockScore),
      features: {
        kyc_level: request.entityFeatures.kycLevel,
        entity_age: request.entityFeatures.entityAge,
        industry_risk: request.entityFeatures.industryRiskScore,
      },
      explainability: {
        topFeatures: [
          { feature: 'kyc_level', importance: 0.4, value: request.entityFeatures.kycLevel, impact: 'negative' },
          { feature: 'entity_age', importance: 0.3, value: request.entityFeatures.entityAge, impact: 'negative' },
          { feature: 'industry_risk', importance: 0.3, value: request.entityFeatures.industryRiskScore, impact: 'positive' },
        ],
      },
      alertRecommendations: [],
    };
  }

  private getMockAnomalyDetection(request: MLPredictionRequest): any {
    const isAnomaly = Math.random() < 0.1; // 10% chance of anomaly
    
    return {
      isAnomaly,
      anomalyScore: isAnomaly ? 0.7 + Math.random() * 0.3 : Math.random() * 0.3,
      anomalyType: isAnomaly ? ['velocity_anomaly', 'amount_anomaly'] : [],
      explanation: isAnomaly ? 'Transaction pattern deviates significantly from historical behavior' : 'Normal transaction pattern',
    };
  }

  private getMockModelPerformance(modelName: string): any {
    return {
      model: modelName,
      accuracy: 0.89 + Math.random() * 0.1,
      precision: 0.85 + Math.random() * 0.1,
      recall: 0.82 + Math.random() * 0.1,
      f1_score: 0.86 + Math.random() * 0.1,
      auc_roc: 0.91 + Math.random() * 0.08,
      lastEvaluation: new Date().toISOString(),
      trainingDataSize: 50000 + Math.floor(Math.random() * 20000),
    };
  }
}