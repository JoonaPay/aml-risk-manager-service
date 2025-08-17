import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RiskAssessmentService } from '../domain/services/risk-assessment.service';
import { MLRiskScoringService } from '../domain/services/ml-risk-scoring.service';
import { AlertManagementService } from '../domain/services/alert-management.service';
import { 
  TransactionAssessmentRequestDto,
  TransactionAssessmentResponseDto,
  TransactionMonitoringRequestDto,
  TransactionRiskQueryDto,
  TransactionRiskResponseDto,
} from '../dto/requests/transaction.dto';

@ApiTags('Transaction Assessment')
@ApiBearerAuth()
@Controller('api/v1/transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    private readonly riskAssessmentService: RiskAssessmentService,
    private readonly mlRiskScoringService: MLRiskScoringService,
    private readonly alertManagementService: AlertManagementService,
  ) {}

  @Post('assess')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assess transaction risk in real-time' })
  @ApiResponse({
    status: 200,
    description: 'Transaction risk assessment completed',
    type: TransactionAssessmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid transaction data' })
  async assessTransaction(
    @Body() assessmentRequest: TransactionAssessmentRequestDto,
  ): Promise<TransactionAssessmentResponseDto> {
    try {
      this.logger.log(`Assessing transaction risk for transaction: ${assessmentRequest.transactionId}`);

      // Get risk profile for the entity
      const riskProfile = await this.riskAssessmentService.getRiskProfileByEntityId(
        assessmentRequest.entityId,
      );

      if (!riskProfile) {
        throw new BadRequestException(`Risk profile not found for entity: ${assessmentRequest.entityId}`);
      }

      // Perform ML-based risk scoring
      const mlScoring = await this.mlRiskScoringService.assessTransactionRisk({
        transactionId: assessmentRequest.transactionId,
        entityId: assessmentRequest.entityId,
        amount: assessmentRequest.amount,
        currency: assessmentRequest.currency,
        transactionType: assessmentRequest.transactionType,
        counterparty: assessmentRequest.counterparty,
        geolocation: assessmentRequest.geolocation,
        timestamp: assessmentRequest.timestamp,
        riskProfile: riskProfile,
        additionalFeatures: assessmentRequest.additionalFeatures,
      });

      // Check monitoring rules
      const ruleResults = await this.riskAssessmentService.evaluateTransactionRules(
        assessmentRequest,
        riskProfile,
      );

      // Calculate overall risk score
      const overallRiskScore = this.calculateOverallRiskScore(mlScoring, ruleResults);

      // Generate alerts if thresholds are exceeded
      const alerts = await this.generateAlertsIfNeeded(
        assessmentRequest,
        riskProfile,
        overallRiskScore,
        mlScoring,
        ruleResults,
      );

      const response: TransactionAssessmentResponseDto = {
        transactionId: assessmentRequest.transactionId,
        entityId: assessmentRequest.entityId,
        riskScore: overallRiskScore,
        riskLevel: this.calculateRiskLevel(overallRiskScore),
        mlScoring: {
          modelVersion: mlScoring.modelVersion,
          prediction: mlScoring.prediction,
          confidence: mlScoring.confidence,
          features: mlScoring.features,
          explainability: mlScoring.explainability,
        },
        ruleResults: ruleResults.map(result => ({
          ruleId: result.ruleId,
          ruleName: result.ruleName,
          triggered: result.triggered,
          score: result.score,
          threshold: result.threshold,
          reason: result.reason,
        })),
        alerts: alerts.map(alert => ({
          alertId: alert.id,
          alertType: alert.alert_type,
          severity: alert.severity,
          riskScore: alert.risk_score,
        })),
        recommendation: this.generateRecommendation(overallRiskScore, alerts.length > 0),
        assessmentDate: new Date(),
        processingTimeMs: Date.now() - assessmentRequest.timestamp.getTime(),
      };

      this.logger.log(`Transaction assessment completed. Risk score: ${overallRiskScore}, Alerts: ${alerts.length}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to assess transaction: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to assess transaction risk');
    }
  }

  @Get(':id/risk')
  @ApiOperation({ summary: 'Get existing transaction risk assessment' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction risk details',
    type: TransactionRiskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction risk assessment not found' })
  async getTransactionRisk(@Param('id') transactionId: string): Promise<TransactionRiskResponseDto> {
    try {
      this.logger.log(`Retrieving transaction risk for: ${transactionId}`);

      const riskAssessment = await this.riskAssessmentService.getTransactionRiskAssessment(transactionId);
      if (!riskAssessment) {
        throw new NotFoundException(`Transaction risk assessment not found for: ${transactionId}`);
      }

      return riskAssessment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve transaction risk: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve transaction risk');
    }
  }

  @Post('monitor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start real-time monitoring for transaction patterns' })
  @ApiResponse({
    status: 200,
    description: 'Transaction monitoring started',
    type: 'object',
  })
  async startTransactionMonitoring(
    @Body() monitoringRequest: TransactionMonitoringRequestDto,
  ): Promise<{ message: string; monitoringId: string }> {
    try {
      this.logger.log(`Starting transaction monitoring for entity: ${monitoringRequest.entityId}`);

      const monitoringId = await this.riskAssessmentService.startTransactionMonitoring(monitoringRequest);

      return {
        message: 'Transaction monitoring started successfully',
        monitoringId,
      };
    } catch (error) {
      this.logger.error(`Failed to start transaction monitoring: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to start transaction monitoring');
    }
  }

  @Get('risk/search')
  @ApiOperation({ summary: 'Search transaction risk assessments' })
  @ApiResponse({
    status: 200,
    description: 'Transaction risk search results',
    type: [TransactionRiskResponseDto],
  })
  async searchTransactionRisk(
    @Query() query: TransactionRiskQueryDto,
  ): Promise<{ data: TransactionRiskResponseDto[]; total: number; page: number; limit: number }> {
    try {
      this.logger.log('Searching transaction risk assessments', query);

      const result = await this.riskAssessmentService.searchTransactionRisk(query);

      return {
        data: result.data,
        total: result.total,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    } catch (error) {
      this.logger.error(`Failed to search transaction risk: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to search transaction risk');
    }
  }

  @Get('patterns/:entityId')
  @ApiOperation({ summary: 'Analyze transaction patterns for an entity' })
  @ApiParam({ name: 'entityId', description: 'Entity ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction pattern analysis',
    type: 'object',
  })
  async analyzeTransactionPatterns(
    @Param('entityId') entityId: string,
    @Query('period') period: string = '30d',
  ): Promise<any> {
    try {
      this.logger.log(`Analyzing transaction patterns for entity: ${entityId}`);

      const patterns = await this.riskAssessmentService.analyzeTransactionPatterns(entityId, period);

      return patterns;
    } catch (error) {
      this.logger.error(`Failed to analyze transaction patterns: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to analyze transaction patterns');
    }
  }

  @Get('velocity/:entityId')
  @ApiOperation({ summary: 'Check transaction velocity for an entity' })
  @ApiParam({ name: 'entityId', description: 'Entity ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction velocity analysis',
    type: 'object',
  })
  async checkTransactionVelocity(
    @Param('entityId') entityId: string,
    @Query('timeWindow') timeWindow: string = '24h',
  ): Promise<any> {
    try {
      this.logger.log(`Checking transaction velocity for entity: ${entityId}`);

      const velocityCheck = await this.riskAssessmentService.checkTransactionVelocity(entityId, timeWindow);

      return velocityCheck;
    } catch (error) {
      this.logger.error(`Failed to check transaction velocity: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to check transaction velocity');
    }
  }

  private calculateOverallRiskScore(mlScoring: any, ruleResults: any[]): number {
    // Combine ML score with rule-based scores
    const mlWeight = 0.6;
    const ruleWeight = 0.4;

    const maxRuleScore = Math.max(...ruleResults.map(r => r.score), 0);
    
    return Math.round((mlScoring.prediction * mlWeight + maxRuleScore * ruleWeight) * 100) / 100;
  }

  private calculateRiskLevel(score: number): string {
    if (score >= 90) return 'CRITICAL';
    if (score >= 75) return 'HIGH';
    if (score >= 50) return 'MEDIUM';
    return 'LOW';
  }

  private async generateAlertsIfNeeded(
    transaction: TransactionAssessmentRequestDto,
    riskProfile: any,
    riskScore: number,
    mlScoring: any,
    ruleResults: any[],
  ): Promise<any[]> {
    const alerts = [];

    // Check if risk score exceeds alert threshold
    if (riskScore >= riskProfile.alert_threshold) {
      const alert = await this.alertManagementService.createAlert({
        entityId: transaction.entityId,
        alertType: this.determineAlertType(ruleResults, mlScoring),
        severity: this.calculateRiskLevel(riskScore),
        riskScore: riskScore,
        transactionId: transaction.transactionId,
        transactionAmount: transaction.amount,
        transactionCurrency: transaction.currency,
        detectionRules: ruleResults.filter(r => r.triggered),
        mlFeatures: mlScoring.features,
        alertData: {
          transaction: transaction,
          riskProfile: { id: riskProfile.id },
          mlScoring: mlScoring,
        },
      });

      alerts.push(alert);
    }

    // Check specific rule violations
    for (const rule of ruleResults.filter(r => r.triggered)) {
      if (rule.autoAlert) {
        const alert = await this.alertManagementService.createAlert({
          entityId: transaction.entityId,
          alertType: rule.alertType || 'RULE_VIOLATION',
          severity: rule.severity || 'MEDIUM',
          riskScore: rule.score,
          transactionId: transaction.transactionId,
          transactionAmount: transaction.amount,
          transactionCurrency: transaction.currency,
          detectionRules: [rule],
          alertData: {
            transaction: transaction,
            rule: rule,
          },
        });

        alerts.push(alert);
      }
    }

    return alerts;
  }

  private determineAlertType(ruleResults: any[], mlScoring: any): string {
    const triggeredRules = ruleResults.filter(r => r.triggered);
    
    if (triggeredRules.length === 0) {
      return 'ML_ANOMALY_DETECTION';
    }

    // Prioritize by rule type
    const priorityTypes = [
      'SANCTIONS_HIT',
      'PEP_TRANSACTION',
      'STRUCTURING',
      'HIGH_VALUE_TRANSACTION',
      'VELOCITY_CHECK',
      'UNUSUAL_PATTERN',
    ];

    for (const type of priorityTypes) {
      if (triggeredRules.some(r => r.ruleType === type)) {
        return type;
      }
    }

    return triggeredRules[0].ruleType || 'UNUSUAL_PATTERN';
  }

  private generateRecommendation(riskScore: number, hasAlerts: boolean): string {
    if (hasAlerts) {
      return 'REVIEW_REQUIRED';
    }

    if (riskScore >= 75) {
      return 'ENHANCED_MONITORING';
    }

    if (riskScore >= 50) {
      return 'STANDARD_MONITORING';
    }

    return 'PROCEED';
  }
}