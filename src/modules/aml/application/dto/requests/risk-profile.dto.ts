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
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EntityType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum CustomerType {
  RETAIL = 'RETAIL',
  CORPORATE = 'CORPORATE',
  HIGH_NET_WORTH = 'HIGH_NET_WORTH',
  INSTITUTIONAL = 'INSTITUTIONAL',
}

export enum RegulatoryStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  EXEMPT = 'EXEMPT',
}

export enum DueDiligenceLevel {
  BASIC = 'BASIC',
  ENHANCED = 'ENHANCED',
  ONGOING = 'ONGOING',
}

export enum AssessmentFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY',
}

export class RiskFactorsDto {
  @ApiProperty({ description: 'Geographic risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  geographicRisk!: number;

  @ApiProperty({ description: 'Product/service risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  productRisk!: number;

  @ApiProperty({ description: 'Channel risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  channelRisk!: number;

  @ApiPropertyOptional({ description: 'Occupation risk score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  occupationRisk?: number;

  @ApiPropertyOptional({ description: 'Industry risk score (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  industryRisk?: number;

  @ApiProperty({ description: 'Transaction pattern risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  transactionPatternRisk!: number;

  @ApiProperty({ description: 'Velocity risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  velocityRisk!: number;

  @ApiProperty({ description: 'Sanctions risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  sanctionsRisk!: number;

  @ApiProperty({ description: 'PEP risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  pepRisk!: number;

  @ApiProperty({ description: 'Adverse media risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  adverseMediaRisk!: number;

  @ApiProperty({ description: 'Behavioral risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  behavioralRisk!: number;
}

export class TransactionBehaviorDto {
  @ApiProperty({ description: 'Average transaction amount' })
  @IsNumber()
  @Min(0)
  averageTransactionAmount!: number;

  @ApiProperty({ description: 'Transaction frequency per month' })
  @IsNumber()
  @Min(0)
  transactionFrequency!: number;

  @ApiProperty({ description: 'Preferred transaction hours', type: [String] })
  @IsArray()
  @IsString({ each: true })
  preferredTimeOfDay!: string[];

  @ApiProperty({ description: 'Preferred transaction days', type: [String] })
  @IsArray()
  @IsString({ each: true })
  preferredDaysOfWeek!: string[];

  @ApiProperty({ description: 'Geographic transaction patterns', type: [String] })
  @IsArray()
  @IsString({ each: true })
  geographicPatterns!: string[];

  @ApiProperty({ description: 'Counterparty patterns', type: [String] })
  @IsArray()
  @IsString({ each: true })
  counterpartyPatterns!: string[];

  @ApiPropertyOptional({ description: 'Seasonal patterns', type: 'object' })
  @IsOptional()
  @IsObject()
  seasonalPatterns?: Record<string, number>;
}

export class CreateRiskProfileDto {
  @ApiProperty({ description: 'Entity ID (User or Business ID)' })
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType })
  @IsEnum(EntityType)
  entityType!: EntityType;

  @ApiProperty({ description: 'Customer type', enum: CustomerType })
  @IsEnum(CustomerType)
  customerType!: CustomerType;

  @ApiPropertyOptional({ description: 'Customer segment' })
  @IsOptional()
  @IsString()
  customerSegment?: string;

  @ApiProperty({ description: 'Risk factors breakdown' })
  @ValidateNested()
  @Type(() => RiskFactorsDto)
  riskFactors!: RiskFactorsDto;

  @ApiProperty({ description: 'Transaction behavior patterns' })
  @ValidateNested()
  @Type(() => TransactionBehaviorDto)
  transactionBehavior!: TransactionBehaviorDto;

  @ApiPropertyOptional({ description: 'Country of residence (ISO 3166-1 alpha-3)' })
  @IsOptional()
  @IsString()
  countryOfResidence?: string;

  @ApiPropertyOptional({ description: 'Countries of operation', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countriesOfOperation?: string[];

  @ApiPropertyOptional({ description: 'PEP status' })
  @IsOptional()
  @IsBoolean()
  pepStatus?: boolean;

  @ApiPropertyOptional({ description: 'Sanctions hit detected' })
  @IsOptional()
  @IsBoolean()
  sanctionsHit?: boolean;

  @ApiPropertyOptional({ description: 'Adverse media detected' })
  @IsOptional()
  @IsBoolean()
  adverseMedia?: boolean;

  @ApiPropertyOptional({ description: 'Due diligence level', enum: DueDiligenceLevel })
  @IsOptional()
  @IsEnum(DueDiligenceLevel)
  dueDiligenceLevel?: DueDiligenceLevel;

  @ApiPropertyOptional({ description: 'Assessment frequency', enum: AssessmentFrequency })
  @IsOptional()
  @IsEnum(AssessmentFrequency)
  assessmentFrequency?: AssessmentFrequency;

  @ApiPropertyOptional({ description: 'Risk appetite threshold (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  riskAppetiteThreshold?: number;

  @ApiPropertyOptional({ description: 'Alert threshold (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  alertThreshold?: number;

  @ApiPropertyOptional({ description: 'Enable monitoring' })
  @IsOptional()
  @IsBoolean()
  monitoringEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Assessor user ID' })
  @IsOptional()
  @IsUUID()
  assessedBy?: string;

  @ApiPropertyOptional({ description: 'Additional metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateRiskProfileDto {
  @ApiPropertyOptional({ description: 'Customer type', enum: CustomerType })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType;

  @ApiPropertyOptional({ description: 'Customer segment' })
  @IsOptional()
  @IsString()
  customerSegment?: string;

  @ApiPropertyOptional({ description: 'Risk factors breakdown' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RiskFactorsDto)
  riskFactors?: RiskFactorsDto;

  @ApiPropertyOptional({ description: 'Transaction behavior patterns' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionBehaviorDto)
  transactionBehavior?: TransactionBehaviorDto;

  @ApiPropertyOptional({ description: 'Country of residence (ISO 3166-1 alpha-3)' })
  @IsOptional()
  @IsString()
  countryOfResidence?: string;

  @ApiPropertyOptional({ description: 'Countries of operation', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countriesOfOperation?: string[];

  @ApiPropertyOptional({ description: 'PEP status' })
  @IsOptional()
  @IsBoolean()
  pepStatus?: boolean;

  @ApiPropertyOptional({ description: 'Sanctions hit detected' })
  @IsOptional()
  @IsBoolean()
  sanctionsHit?: boolean;

  @ApiPropertyOptional({ description: 'Adverse media detected' })
  @IsOptional()
  @IsBoolean()
  adverseMedia?: boolean;

  @ApiPropertyOptional({ description: 'Regulatory status', enum: RegulatoryStatus })
  @IsOptional()
  @IsEnum(RegulatoryStatus)
  regulatoryStatus?: RegulatoryStatus;

  @ApiPropertyOptional({ description: 'Due diligence level', enum: DueDiligenceLevel })
  @IsOptional()
  @IsEnum(DueDiligenceLevel)
  dueDiligenceLevel?: DueDiligenceLevel;

  @ApiPropertyOptional({ description: 'Assessment frequency', enum: AssessmentFrequency })
  @IsOptional()
  @IsEnum(AssessmentFrequency)
  assessmentFrequency?: AssessmentFrequency;

  @ApiPropertyOptional({ description: 'Risk appetite threshold (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  riskAppetiteThreshold?: number;

  @ApiPropertyOptional({ description: 'Alert threshold (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  alertThreshold?: number;

  @ApiPropertyOptional({ description: 'Enable monitoring' })
  @IsOptional()
  @IsBoolean()
  monitoringEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Assessor user ID' })
  @IsOptional()
  @IsUUID()
  assessedBy?: string;

  @ApiPropertyOptional({ description: 'Additional metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class RiskProfileQueryDto {
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

  @ApiPropertyOptional({ description: 'Filter by risk level', enum: RiskLevel })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ description: 'Filter by entity type', enum: EntityType })
  @IsOptional()
  @IsEnum(EntityType)
  entityType?: EntityType;

  @ApiPropertyOptional({ description: 'Filter by customer type', enum: CustomerType })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType;

  @ApiPropertyOptional({ description: 'Filter by monitoring status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  monitoringEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Filter by PEP status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  pepStatus?: boolean;

  @ApiPropertyOptional({ description: 'Filter by sanctions hit' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  sanctionsHit?: boolean;

  @ApiPropertyOptional({ description: 'Filter by regulatory status', enum: RegulatoryStatus })
  @IsOptional()
  @IsEnum(RegulatoryStatus)
  regulatoryStatus?: RegulatoryStatus;

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

  @ApiPropertyOptional({ description: 'Search in notes and metadata' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class RiskAssessmentRequestDto {
  @ApiPropertyOptional({ description: 'Force full reassessment' })
  @IsOptional()
  @IsBoolean()
  fullReassessment?: boolean;

  @ApiPropertyOptional({ description: 'Include ML model prediction' })
  @IsOptional()
  @IsBoolean()
  includeMlPrediction?: boolean;

  @ApiPropertyOptional({ description: 'Specific ML model version to use' })
  @IsOptional()
  @IsString()
  mlModelVersion?: string;

  @ApiPropertyOptional({ description: 'Additional context for assessment', type: 'object' })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class RiskProfileResponseDto {
  @ApiProperty({ description: 'Risk profile ID' })
  id!: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId!: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType })
  entityType!: EntityType;

  @ApiProperty({ description: 'Risk level', enum: RiskLevel })
  riskLevel!: RiskLevel;

  @ApiProperty({ description: 'Overall risk score (0-100)' })
  overallRiskScore!: number;

  @ApiProperty({ description: 'Customer type', enum: CustomerType })
  customerType!: CustomerType;

  @ApiPropertyOptional({ description: 'Customer segment' })
  customerSegment?: string;

  @ApiProperty({ description: 'Geographic risk level', enum: RiskLevel })
  geographicRisk!: RiskLevel;

  @ApiProperty({ description: 'Product risk level', enum: RiskLevel })
  productRisk!: RiskLevel;

  @ApiProperty({ description: 'Channel risk level', enum: RiskLevel })
  channelRisk!: RiskLevel;

  @ApiPropertyOptional({ description: 'Occupation risk level', enum: RiskLevel })
  occupationRisk?: RiskLevel;

  @ApiPropertyOptional({ description: 'Industry risk level', enum: RiskLevel })
  industryRisk?: RiskLevel;

  @ApiProperty({ description: 'PEP status' })
  pepStatus!: boolean;

  @ApiProperty({ description: 'Sanctions hit detected' })
  sanctionsHit!: boolean;

  @ApiProperty({ description: 'Adverse media detected' })
  adverseMedia!: boolean;

  @ApiProperty({ description: 'Risk factors breakdown', type: 'object' })
  riskFactors!: Record<string, any>;

  @ApiProperty({ description: 'Transaction behavior patterns', type: 'object' })
  transactionBehavior!: Record<string, any>;

  @ApiPropertyOptional({ description: 'ML risk scoring results', type: 'object' })
  mlRiskScoring?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Country of residence' })
  countryOfResidence?: string;

  @ApiPropertyOptional({ description: 'Countries of operation', type: [String] })
  countriesOfOperation?: string[];

  @ApiProperty({ description: 'Regulatory status', enum: RegulatoryStatus })
  regulatoryStatus!: RegulatoryStatus;

  @ApiProperty({ description: 'Due diligence level', enum: DueDiligenceLevel })
  dueDiligenceLevel!: DueDiligenceLevel;

  @ApiProperty({ description: 'Last assessment date' })
  lastAssessmentDate!: Date;

  @ApiPropertyOptional({ description: 'Next assessment date' })
  nextAssessmentDate?: Date;

  @ApiProperty({ description: 'Assessment frequency', enum: AssessmentFrequency })
  assessmentFrequency!: AssessmentFrequency;

  @ApiProperty({ description: 'Risk appetite threshold' })
  riskAppetiteThreshold!: number;

  @ApiProperty({ description: 'Monitoring enabled' })
  monitoringEnabled!: boolean;

  @ApiProperty({ description: 'Alert threshold' })
  alertThreshold!: number;

  @ApiPropertyOptional({ description: 'Notes' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Assessor user ID' })
  assessedBy?: string;

  @ApiPropertyOptional({ description: 'Approver user ID' })
  approvedBy?: string;

  @ApiPropertyOptional({ description: 'Approval date' })
  approvedAt?: Date;

  @ApiPropertyOptional({ description: 'Additional metadata', type: 'object' })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class RiskAssessmentResponseDto {
  @ApiProperty({ description: 'Assessment ID' })
  id!: string;

  @ApiProperty({ description: 'Risk profile ID' })
  riskProfileId!: string;

  @ApiProperty({ description: 'Previous risk score' })
  previousRiskScore!: number;

  @ApiProperty({ description: 'New risk score' })
  newRiskScore!: number;

  @ApiProperty({ description: 'Previous risk level', enum: RiskLevel })
  previousRiskLevel!: RiskLevel;

  @ApiProperty({ description: 'New risk level', enum: RiskLevel })
  newRiskLevel!: RiskLevel;

  @ApiProperty({ description: 'Changes detected', type: 'object' })
  changes!: Record<string, any>;

  @ApiProperty({ description: 'Assessment details', type: 'object' })
  assessmentDetails!: Record<string, any>;

  @ApiPropertyOptional({ description: 'ML prediction results', type: 'object' })
  mlPrediction?: Record<string, any>;

  @ApiProperty({ description: 'Assessment timestamp' })
  assessmentDate!: Date;

  @ApiProperty({ description: 'Assessor user ID' })
  assessedBy!: string;
}