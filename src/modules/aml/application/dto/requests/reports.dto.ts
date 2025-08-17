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
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportType {
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  CURRENCY_TRANSACTION = 'CURRENCY_TRANSACTION',
  MONETARY_INSTRUMENT = 'MONETARY_INSTRUMENT',
  FOREIGN_BANK_ACCOUNT = 'FOREIGN_BANK_ACCOUNT',
  SHELL_BANK = 'SHELL_BANK',
  CORRESPONDENT_ACCOUNT = 'CORRESPONDENT_ACCOUNT',
  WIRE_TRANSFER = 'WIRE_TRANSFER',
  CASH_TRANSACTION = 'CASH_TRANSACTION',
  MONEY_LAUNDERING = 'MONEY_LAUNDERING',
  TERRORIST_FINANCING = 'TERRORIST_FINANCING',
  OTHER_SUSPICIOUS = 'OTHER_SUSPICIOUS',
}

export enum FilingReason {
  UNUSUAL_TRANSACTION_PATTERN = 'UNUSUAL_TRANSACTION_PATTERN',
  HIGH_RISK_GEOGRAPHY = 'HIGH_RISK_GEOGRAPHY',
  SANCTIONS_MATCH = 'SANCTIONS_MATCH',
  PEP_INVOLVEMENT = 'PEP_INVOLVEMENT',
  STRUCTURING_ACTIVITY = 'STRUCTURING_ACTIVITY',
  ROUND_DOLLAR_AMOUNTS = 'ROUND_DOLLAR_AMOUNTS',
  RAPID_FUND_MOVEMENT = 'RAPID_FUND_MOVEMENT',
  DORMANT_ACCOUNT_ACTIVITY = 'DORMANT_ACCOUNT_ACTIVITY',
  CASH_INTENSIVE_BUSINESS = 'CASH_INTENSIVE_BUSINESS',
  UNUSUAL_VELOCITY = 'UNUSUAL_VELOCITY',
  SUSPICIOUS_WIRE_TRANSFERS = 'SUSPICIOUS_WIRE_TRANSFERS',
  INCONSISTENT_WITH_PROFILE = 'INCONSISTENT_WITH_PROFILE',
  REGULATORY_REQUIREMENT = 'REGULATORY_REQUIREMENT',
  OTHER = 'OTHER',
}

export enum SarPriority {
  ROUTINE = 'ROUTINE',
  PRIORITY = 'PRIORITY',
  IMMEDIATE = 'IMMEDIATE',
}

export enum SarStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  FILED = 'FILED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  REJECTED = 'REJECTED',
  AMENDED = 'AMENDED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum RegulatoryAgency {
  FINCEN = 'FINCEN',
  OCC = 'OCC',
  FDIC = 'FDIC',
  FRB = 'FRB',
  NCUA = 'NCUA',
  IRS = 'IRS',
  OTHER = 'OTHER',
}

export enum EntityType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export class SubjectInformationDto {
  @ApiProperty({ description: 'Subject name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'Subject address' })
  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @ApiPropertyOptional({ description: 'Subject identification' })
  @IsOptional()
  @IsObject()
  identification?: {
    type: string; // SSN, EIN, Passport, etc.
    number: string;
    issuingCountry?: string;
    expirationDate?: Date;
  };

  @ApiPropertyOptional({ description: 'Subject contact information' })
  @IsOptional()
  @IsObject()
  contactInfo?: {
    phone?: string;
    email?: string;
    alternateContact?: string;
  };

  @ApiPropertyOptional({ description: 'Subject date of birth' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiPropertyOptional({ description: 'Subject occupation/business type' })
  @IsOptional()
  @IsString()
  occupation?: string;
}

export class CreateSarReportDto {
  @ApiProperty({ description: 'Related alert ID' })
  @IsUUID()
  @IsNotEmpty()
  alertId!: string;

  @ApiProperty({ description: 'Subject entity ID' })
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType })
  @IsEnum(EntityType)
  entityType!: EntityType;

  @ApiProperty({ description: 'Report type', enum: ReportType })
  @IsEnum(ReportType)
  reportType!: ReportType;

  @ApiProperty({ description: 'Filing reason', enum: FilingReason })
  @IsEnum(FilingReason)
  filingReason!: FilingReason;

  @ApiPropertyOptional({ description: 'Report priority', enum: SarPriority })
  @IsOptional()
  @IsEnum(SarPriority)
  priority?: SarPriority;

  @ApiProperty({ description: 'Subject information' })
  @ValidateNested()
  @Type(() => SubjectInformationDto)
  subjectInformation!: SubjectInformationDto;

  @ApiProperty({ description: 'Suspicious activity details', type: 'object' })
  @IsObject()
  suspiciousActivityDetails!: Record<string, any>;

  @ApiProperty({ description: 'Transaction details', type: 'object' })
  @IsObject()
  transactionDetails!: Record<string, any>;

  @ApiProperty({ description: 'Financial institution information', type: 'object' })
  @IsObject()
  financialInstitutionInfo!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Law enforcement information', type: 'object' })
  @IsOptional()
  @IsObject()
  lawEnforcementInfo?: Record<string, any>;

  @ApiProperty({ description: 'Suspicious activity period', type: 'object' })
  @IsObject()
  suspiciousActivityPeriod!: {
    startDate: Date;
    endDate: Date;
  };

  @ApiPropertyOptional({ description: 'Total amount involved' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmountInvolved?: number;

  @ApiPropertyOptional({ description: 'Currency (ISO 4217)' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Narrative description of suspicious activity' })
  @IsString()
  @IsNotEmpty()
  narrativeDescription!: string;

  @ApiPropertyOptional({ description: 'Law enforcement notified' })
  @IsOptional()
  @IsBoolean()
  lawEnforcementNotified?: boolean;

  @ApiPropertyOptional({ description: 'Law enforcement agency' })
  @IsOptional()
  @IsString()
  lawEnforcementAgency?: string;

  @ApiPropertyOptional({ description: 'Regulatory agency', enum: RegulatoryAgency })
  @IsOptional()
  @IsEnum(RegulatoryAgency)
  regulatoryAgency?: RegulatoryAgency;

  @ApiPropertyOptional({ description: 'Supporting documentation', type: 'object' })
  @IsOptional()
  @IsObject()
  supportingDocumentation?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Internal case number' })
  @IsOptional()
  @IsString()
  internalCaseNumber?: string;

  @ApiPropertyOptional({ description: 'Risk assessment details', type: 'object' })
  @IsOptional()
  @IsObject()
  riskAssessment?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Investigation summary' })
  @IsOptional()
  @IsString()
  investigationSummary?: string;

  @ApiPropertyOptional({ description: 'Follow-up actions', type: 'object' })
  @IsOptional()
  @IsObject()
  followUpActions?: Record<string, any>;

  @ApiProperty({ description: 'Creator user ID' })
  @IsUUID()
  @IsNotEmpty()
  createdBy!: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateSarReportDto {
  @ApiPropertyOptional({ description: 'Report priority', enum: SarPriority })
  @IsOptional()
  @IsEnum(SarPriority)
  priority?: SarPriority;

  @ApiPropertyOptional({ description: 'Subject information' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SubjectInformationDto)
  subjectInformation?: SubjectInformationDto;

  @ApiPropertyOptional({ description: 'Suspicious activity details', type: 'object' })
  @IsOptional()
  @IsObject()
  suspiciousActivityDetails?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Transaction details', type: 'object' })
  @IsOptional()
  @IsObject()
  transactionDetails?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Law enforcement information', type: 'object' })
  @IsOptional()
  @IsObject()
  lawEnforcementInfo?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Total amount involved' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmountInvolved?: number;

  @ApiPropertyOptional({ description: 'Narrative description' })
  @IsOptional()
  @IsString()
  narrativeDescription?: string;

  @ApiPropertyOptional({ description: 'Law enforcement notified' })
  @IsOptional()
  @IsBoolean()
  lawEnforcementNotified?: boolean;

  @ApiPropertyOptional({ description: 'Supporting documentation', type: 'object' })
  @IsOptional()
  @IsObject()
  supportingDocumentation?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Investigation summary' })
  @IsOptional()
  @IsString()
  investigationSummary?: string;

  @ApiPropertyOptional({ description: 'Follow-up actions', type: 'object' })
  @IsOptional()
  @IsObject()
  followUpActions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Amendment reason (if applicable)' })
  @IsOptional()
  @IsString()
  amendmentReason?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class SarReportQueryDto {
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

  @ApiPropertyOptional({ description: 'Filter by report type', enum: ReportType })
  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;

  @ApiPropertyOptional({ description: 'Filter by filing reason', enum: FilingReason })
  @IsOptional()
  @IsEnum(FilingReason)
  filingReason?: FilingReason;

  @ApiPropertyOptional({ description: 'Filter by status', enum: SarStatus })
  @IsOptional()
  @IsEnum(SarStatus)
  status?: SarStatus;

  @ApiPropertyOptional({ description: 'Filter by priority', enum: SarPriority })
  @IsOptional()
  @IsEnum(SarPriority)
  priority?: SarPriority;

  @ApiPropertyOptional({ description: 'Filter by filing date from (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  filingDateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by filing date to (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  filingDateTo?: string;

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

  @ApiPropertyOptional({ description: 'Search in narrative and subject information' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class ComplianceReportRequestDto {
  @ApiProperty({ description: 'Report type' })
  @IsIn(['monthly', 'quarterly', 'annual', 'custom'])
  reportType!: string;

  @ApiProperty({ description: 'Report period start date' })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({ description: 'Report period end date' })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @ApiPropertyOptional({ description: 'Include specific metrics', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeMetrics?: string[];

  @ApiPropertyOptional({ description: 'Include detailed breakdowns' })
  @IsOptional()
  @IsBoolean()
  includeDetails?: boolean;

  @ApiPropertyOptional({ description: 'Export format' })
  @IsOptional()
  @IsIn(['pdf', 'excel', 'json'])
  format?: string;

  @ApiProperty({ description: 'Requested by user ID' })
  @IsUUID()
  @IsNotEmpty()
  requestedBy!: string;
}

export class SarReportResponseDto {
  @ApiProperty({ description: 'SAR report ID' })
  id!: string;

  @ApiProperty({ description: 'SAR reference number' })
  sarReference!: string;

  @ApiProperty({ description: 'Related alert ID' })
  alertId!: string;

  @ApiProperty({ description: 'Subject entity ID' })
  entityId!: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType })
  entityType!: EntityType;

  @ApiProperty({ description: 'Report type', enum: ReportType })
  reportType!: ReportType;

  @ApiProperty({ description: 'Filing reason', enum: FilingReason })
  filingReason!: FilingReason;

  @ApiProperty({ description: 'Report priority', enum: SarPriority })
  priority!: SarPriority;

  @ApiProperty({ description: 'Report status', enum: SarStatus })
  status!: SarStatus;

  @ApiProperty({ description: 'Subject information', type: 'object' })
  subjectInformation!: Record<string, any>;

  @ApiProperty({ description: 'Suspicious activity details', type: 'object' })
  suspiciousActivityDetails!: Record<string, any>;

  @ApiProperty({ description: 'Transaction details', type: 'object' })
  transactionDetails!: Record<string, any>;

  @ApiProperty({ description: 'Financial institution information', type: 'object' })
  financialInstitutionInfo!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Law enforcement information', type: 'object' })
  lawEnforcementInfo?: Record<string, any>;

  @ApiProperty({ description: 'Suspicious activity period', type: 'object' })
  suspiciousActivityPeriod!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Total amount involved' })
  totalAmountInvolved?: number;

  @ApiProperty({ description: 'Currency' })
  currency!: string;

  @ApiProperty({ description: 'Narrative description' })
  narrativeDescription!: string;

  @ApiProperty({ description: 'Law enforcement notified' })
  lawEnforcementNotified!: boolean;

  @ApiPropertyOptional({ description: 'Law enforcement agency' })
  lawEnforcementAgency?: string;

  @ApiProperty({ description: 'Regulatory agency', enum: RegulatoryAgency })
  regulatoryAgency!: RegulatoryAgency;

  @ApiProperty({ description: 'Filing method' })
  filingMethod!: string;

  @ApiProperty({ description: 'Form type' })
  formType!: string;

  @ApiPropertyOptional({ description: 'BSA E-Filing System ID' })
  bsaId?: string;

  @ApiPropertyOptional({ description: 'Government acknowledgment number' })
  acknowledgmentNumber?: string;

  @ApiPropertyOptional({ description: 'Filing date' })
  filingDate?: Date;

  @ApiProperty({ description: 'Filing deadline' })
  filingDeadline!: Date;

  @ApiProperty({ description: 'Late filing flag' })
  lateFiling!: boolean;

  @ApiPropertyOptional({ description: 'Late filing reason' })
  lateFilingReason?: string;

  @ApiPropertyOptional({ description: 'Amendment to SAR reference' })
  amendmentToSar?: string;

  @ApiPropertyOptional({ description: 'Amendment reason' })
  amendmentReason?: string;

  @ApiProperty({ description: 'Corrected SAR flag' })
  correctedSar!: boolean;

  @ApiProperty({ description: 'Confidentiality claim' })
  confidentialityClaim!: boolean;

  @ApiPropertyOptional({ description: 'Supporting documentation', type: 'object' })
  supportingDocumentation?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Internal case number' })
  internalCaseNumber?: string;

  @ApiPropertyOptional({ description: 'Risk assessment', type: 'object' })
  riskAssessment?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Investigation summary' })
  investigationSummary?: string;

  @ApiPropertyOptional({ description: 'Follow-up actions', type: 'object' })
  followUpActions?: Record<string, any>;

  @ApiProperty({ description: 'Quality assurance review completed' })
  qualityAssuranceReview!: boolean;

  @ApiProperty({ description: 'Compliance officer review completed' })
  complianceOfficerReview!: boolean;

  @ApiProperty({ description: 'Legal review completed' })
  legalReview!: boolean;

  @ApiProperty({ description: 'Auto-generated flag' })
  autoGenerated!: boolean;

  @ApiProperty({ description: 'AI-assisted flag' })
  aiAssisted!: boolean;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Creator user ID' })
  createdBy!: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class ComplianceReportResponseDto {
  @ApiProperty({ description: 'Report ID' })
  id!: string;

  @ApiProperty({ description: 'Report type' })
  reportType!: string;

  @ApiProperty({ description: 'Report period' })
  period!: {
    startDate: Date;
    endDate: Date;
  };

  @ApiProperty({ description: 'Alert metrics', type: 'object' })
  alertMetrics!: {
    totalAlerts: number;
    alertsByType: Record<string, number>;
    alertsBySeverity: Record<string, number>;
    resolutionMetrics: Record<string, number>;
  };

  @ApiProperty({ description: 'SAR metrics', type: 'object' })
  sarMetrics!: {
    totalSars: number;
    sarsByType: Record<string, number>;
    filingTimeliness: Record<string, number>;
  };

  @ApiProperty({ description: 'Risk metrics', type: 'object' })
  riskMetrics!: {
    highRiskEntities: number;
    riskTrends: Record<string, number>;
    mlModelPerformance: Record<string, number>;
  };

  @ApiProperty({ description: 'Compliance metrics', type: 'object' })
  complianceMetrics!: {
    slaCompliance: number;
    falsePositiveRate: number;
    investigationEfficiency: number;
  };

  @ApiProperty({ description: 'Key findings', type: [String] })
  keyFindings!: string[];

  @ApiProperty({ description: 'Recommendations', type: [String] })
  recommendations!: string[];

  @ApiProperty({ description: 'Generated timestamp' })
  generatedAt!: Date;

  @ApiProperty({ description: 'Generated by user ID' })
  generatedBy!: string;
}

export class MetricsReportDto {
  @ApiProperty({ description: 'Report period' })
  period!: string;

  @ApiProperty({ description: 'Real-time metrics', type: 'object' })
  realTimeMetrics!: {
    activeAlerts: number;
    highPriorityAlerts: number;
    slaBreaches: number;
    avgResolutionTime: number;
  };

  @ApiProperty({ description: 'Historical trends', type: 'object' })
  historicalTrends!: {
    alertVolume: Array<{ date: Date; count: number }>;
    resolutionTimes: Array<{ date: Date; avgTime: number }>;
    falsePositiveRates: Array<{ date: Date; rate: number }>;
  };

  @ApiProperty({ description: 'Performance metrics', type: 'object' })
  performanceMetrics!: {
    detectionAccuracy: number;
    investigationEfficiency: number;
    complianceScore: number;
    riskCoverage: number;
  };

  @ApiProperty({ description: 'ML model metrics', type: 'object' })
  mlMetrics!: {
    modelAccuracy: number;
    driftDetection: boolean;
    predictionVolume: number;
    featureImportance: Record<string, number>;
  };

  @ApiProperty({ description: 'Generated timestamp' })
  generatedAt!: Date;
}

export class RegulatoryFilingDto {
  @ApiProperty({ description: 'Filing ID' })
  filingId!: string;

  @ApiProperty({ description: 'SAR reference' })
  sarReference!: string;

  @ApiProperty({ description: 'Filing status' })
  status!: string;

  @ApiProperty({ description: 'Submission timestamp' })
  submittedAt!: Date;

  @ApiPropertyOptional({ description: 'Acknowledgment number' })
  acknowledgmentNumber?: string;

  @ApiPropertyOptional({ description: 'Government response', type: 'object' })
  governmentResponse?: Record<string, any>;

  @ApiProperty({ description: 'Filing method' })
  filingMethod!: string;

  @ApiProperty({ description: 'Regulatory agency' })
  regulatoryAgency!: string;
}