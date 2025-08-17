import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
  IsArray,
  Min,
  Max,
  IsNotEmpty,
  ValidateNested,
  IsDateString,
  IsDate,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  EXCHANGE = 'EXCHANGE',
  TRADE = 'TRADE',
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
  OTHER = 'OTHER',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CounterpartyDto {
  @ApiProperty({ description: 'Counterparty ID' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiPropertyOptional({ description: 'Counterparty name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Counterparty type' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Counterparty country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Counterparty bank' })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiPropertyOptional({ description: 'Known risk indicators', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  riskIndicators?: string[];
}

export class GeolocationDto {
  @ApiProperty({ description: 'Country code (ISO 3166-1 alpha-3)' })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Region/State' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ description: 'Latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Is high-risk jurisdiction' })
  @IsOptional()
  @IsBoolean()
  isHighRisk?: boolean;
}

export class TransactionAssessmentRequestDto {
  @ApiProperty({ description: 'Transaction ID' })
  @IsUUID()
  @IsNotEmpty()
  transactionId!: string;

  @ApiProperty({ description: 'Entity ID (User or Business)' })
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ description: 'Transaction currency (ISO 4217)' })
  @IsString()
  @IsNotEmpty()
  currency!: string;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  @IsEnum(TransactionType)
  transactionType!: TransactionType;

  @ApiProperty({ description: 'Transaction timestamp' })
  @IsDate()
  @Type(() => Date)
  timestamp!: Date;

  @ApiPropertyOptional({ description: 'Counterparty information' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CounterpartyDto)
  counterparty?: CounterpartyDto;

  @ApiPropertyOptional({ description: 'Transaction geolocation' })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeolocationDto)
  geolocation?: GeolocationDto;

  @ApiPropertyOptional({ description: 'Transaction channel' })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiPropertyOptional({ description: 'Transaction purpose/description' })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Is cash transaction' })
  @IsOptional()
  @IsBoolean()
  isCash?: boolean;

  @ApiPropertyOptional({ description: 'Is international transaction' })
  @IsOptional()
  @IsBoolean()
  isInternational?: boolean;

  @ApiPropertyOptional({ description: 'Transaction fees' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fees?: number;

  @ApiPropertyOptional({ description: 'Exchange rate if applicable' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  exchangeRate?: number;

  @ApiPropertyOptional({ description: 'Additional transaction features', type: 'object' })
  @IsOptional()
  @IsObject()
  additionalFeatures?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Transaction metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class TransactionMonitoringRequestDto {
  @ApiProperty({ description: 'Entity ID to monitor' })
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ description: 'Monitoring period in hours' })
  @IsNumber()
  @Min(1)
  @Max(720) // Max 30 days
  monitoringPeriodHours!: number;

  @ApiPropertyOptional({ description: 'Specific rules to monitor', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rulesToMonitor?: string[];

  @ApiPropertyOptional({ description: 'Alert threshold override' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  alertThreshold?: number;

  @ApiPropertyOptional({ description: 'Monitoring configuration', type: 'object' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class TransactionRiskQueryDto {
  @ApiPropertyOptional({ description: 'Page number (default: 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page (default: 10, max: 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by entity ID' })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({ description: 'Filter by transaction type', enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @ApiPropertyOptional({ description: 'Filter by risk level', enum: RiskLevel })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ description: 'Filter by minimum amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Filter by currency' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Filter by date from (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by date to (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum risk score' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minRiskScore?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum risk score' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maxRiskScore?: number;

  @ApiPropertyOptional({ description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Include only transactions with alerts' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasAlerts?: boolean;

  @ApiPropertyOptional({ description: 'Search in transaction purpose/description' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class MLScoringDto {
  @ApiProperty({ description: 'ML model version' })
  modelVersion!: string;

  @ApiProperty({ description: 'Risk prediction score (0-1)' })
  prediction!: number;

  @ApiProperty({ description: 'Prediction confidence (0-1)' })
  confidence!: number;

  @ApiProperty({ description: 'Feature values used in prediction', type: 'object' })
  features!: Record<string, number>;

  @ApiProperty({ description: 'Model explainability data', type: 'object' })
  explainability!: {
    topFeatures: Array<{
      feature: string;
      importance: number;
      value: number;
    }>;
  };
}

export class RuleResultDto {
  @ApiProperty({ description: 'Rule ID' })
  ruleId!: string;

  @ApiProperty({ description: 'Rule name' })
  ruleName!: string;

  @ApiProperty({ description: 'Was rule triggered' })
  triggered!: boolean;

  @ApiProperty({ description: 'Rule score (0-100)' })
  score!: number;

  @ApiProperty({ description: 'Rule threshold' })
  threshold!: number;

  @ApiPropertyOptional({ description: 'Trigger reason' })
  reason?: string;
}

export class AlertSummaryDto {
  @ApiProperty({ description: 'Alert ID' })
  alertId!: string;

  @ApiProperty({ description: 'Alert type' })
  alertType!: string;

  @ApiProperty({ description: 'Alert severity', enum: RiskLevel })
  severity!: RiskLevel;

  @ApiProperty({ description: 'Alert risk score' })
  riskScore!: number;
}

export class TransactionAssessmentResponseDto {
  @ApiProperty({ description: 'Transaction ID' })
  transactionId!: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId!: string;

  @ApiProperty({ description: 'Overall risk score (0-100)' })
  riskScore!: number;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  riskLevel!: RiskLevel;

  @ApiProperty({ description: 'ML scoring results' })
  mlScoring!: MLScoringDto;

  @ApiProperty({ description: 'Rule evaluation results', type: [RuleResultDto] })
  ruleResults!: RuleResultDto[];

  @ApiProperty({ description: 'Generated alerts', type: [AlertSummaryDto] })
  alerts!: AlertSummaryDto[];

  @ApiProperty({ description: 'Risk assessment recommendation' })
  @IsIn(['PROCEED', 'REVIEW_REQUIRED', 'ENHANCED_MONITORING', 'BLOCK'])
  recommendation!: string;

  @ApiProperty({ description: 'Assessment timestamp' })
  assessmentDate!: Date;

  @ApiProperty({ description: 'Processing time in milliseconds' })
  processingTimeMs!: number;
}

export class TransactionRiskResponseDto {
  @ApiProperty({ description: 'Transaction ID' })
  transactionId!: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId!: string;

  @ApiProperty({ description: 'Transaction amount' })
  amount!: number;

  @ApiProperty({ description: 'Transaction currency' })
  currency!: string;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  transactionType!: TransactionType;

  @ApiProperty({ description: 'Transaction timestamp' })
  timestamp!: Date;

  @ApiProperty({ description: 'Risk score (0-100)' })
  riskScore!: number;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  riskLevel!: RiskLevel;

  @ApiPropertyOptional({ description: 'Counterparty information' })
  counterparty?: CounterpartyDto;

  @ApiPropertyOptional({ description: 'Geolocation information' })
  geolocation?: GeolocationDto;

  @ApiProperty({ description: 'Number of alerts generated' })
  alertCount!: number;

  @ApiProperty({ description: 'Risk assessment details', type: 'object' })
  assessmentDetails!: Record<string, any>;

  @ApiProperty({ description: 'Assessment date' })
  assessmentDate!: Date;
}