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
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AlertType {
  HIGH_VALUE_TRANSACTION = 'HIGH_VALUE_TRANSACTION',
  UNUSUAL_PATTERN = 'UNUSUAL_PATTERN',
  VELOCITY_CHECK = 'VELOCITY_CHECK',
  SANCTIONS_HIT = 'SANCTIONS_HIT',
  PEP_TRANSACTION = 'PEP_TRANSACTION',
  HIGH_RISK_COUNTRY = 'HIGH_RISK_COUNTRY',
  STRUCTURING = 'STRUCTURING',
  ROUND_DOLLAR_AMOUNTS = 'ROUND_DOLLAR_AMOUNTS',
  DORMANT_ACCOUNT_ACTIVITY = 'DORMANT_ACCOUNT_ACTIVITY',
  FREQUENT_SMALL_TRANSACTIONS = 'FREQUENT_SMALL_TRANSACTIONS',
  CASH_INTENSIVE_BUSINESS = 'CASH_INTENSIVE_BUSINESS',
  RAPID_MOVEMENT_OF_FUNDS = 'RAPID_MOVEMENT_OF_FUNDS',
  ML_ANOMALY_DETECTION = 'ML_ANOMALY_DETECTION',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum AlertStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  ESCALATED = 'ESCALATED',
}

export enum ResolutionType {
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
  SAR_FILED = 'SAR_FILED',
}

export class CreateAlertDto {
  @ApiProperty({ description: 'Entity ID (User or Business)' })
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ description: 'Alert type', enum: AlertType })
  @IsEnum(AlertType)
  alertType!: AlertType;

  @ApiProperty({ description: 'Alert severity', enum: AlertSeverity })
  @IsEnum(AlertSeverity)
  severity!: AlertSeverity;

  @ApiProperty({ description: 'Risk score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore!: number;

  @ApiPropertyOptional({ description: 'Alert priority', enum: AlertPriority })
  @IsOptional()
  @IsEnum(AlertPriority)
  priority?: AlertPriority;

  @ApiPropertyOptional({ description: 'Confidence level (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  confidenceLevel?: number;

  @ApiPropertyOptional({ description: 'Related transaction ID' })
  @IsOptional()
  @IsUUID()
  transactionId?: string;

  @ApiPropertyOptional({ description: 'Transaction amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  transactionAmount?: number;

  @ApiPropertyOptional({ description: 'Transaction currency' })
  @IsOptional()
  @IsString()
  transactionCurrency?: string;

  @ApiProperty({ description: 'Alert data and context', type: 'object' })
  @IsObject()
  alertData!: Record<string, any>;

  @ApiProperty({ description: 'Detection rules that triggered the alert', type: 'object' })
  @IsObject()
  detectionRules!: Record<string, any>;

  @ApiPropertyOptional({ description: 'ML model features', type: 'object' })
  @IsOptional()
  @IsObject()
  mlFeatures?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Related alert IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  relatedAlerts?: string[];

  @ApiPropertyOptional({ description: 'External system references', type: 'object' })
  @IsOptional()
  @IsObject()
  externalReferences?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Additional metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateAlertDto {
  @ApiPropertyOptional({ description: 'Alert priority', enum: AlertPriority })
  @IsOptional()
  @IsEnum(AlertPriority)
  priority?: AlertPriority;

  @ApiPropertyOptional({ description: 'Alert status', enum: AlertStatus })
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Related alert IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  relatedAlerts?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AlertQueryDto {
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

  @ApiPropertyOptional({ description: 'Filter by alert type', enum: AlertType })
  @IsOptional()
  @IsEnum(AlertType)
  alertType?: AlertType;

  @ApiPropertyOptional({ description: 'Filter by severity', enum: AlertSeverity })
  @IsOptional()
  @IsEnum(AlertSeverity)
  severity?: AlertSeverity;

  @ApiPropertyOptional({ description: 'Filter by priority', enum: AlertPriority })
  @IsOptional()
  @IsEnum(AlertPriority)
  priority?: AlertPriority;

  @ApiPropertyOptional({ description: 'Filter by status', enum: AlertStatus })
  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @ApiPropertyOptional({ description: 'Filter by assigned user' })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

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

  @ApiPropertyOptional({ description: 'Filter by date from (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by date to (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by auto-generated alerts' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  autoGenerated?: boolean;

  @ApiPropertyOptional({ description: 'Filter by SLA breached alerts' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  slaBreached?: boolean;

  @ApiPropertyOptional({ description: 'Filter by SAR filed alerts' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  sarFiled?: boolean;

  @ApiPropertyOptional({ description: 'Search in alert data and notes' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort by field' })
  @IsOptional()
  @IsIn(['created_at', 'risk_score', 'sla_due_date', 'updated_at'])
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class AlertAssignmentDto {
  @ApiProperty({ description: 'User ID to assign the alert to' })
  @IsUUID()
  @IsNotEmpty()
  assignedTo!: string;

  @ApiProperty({ description: 'User ID performing the assignment' })
  @IsUUID()
  @IsNotEmpty()
  assignedBy!: string;

  @ApiPropertyOptional({ description: 'Assignment notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AlertInvestigationDto {
  @ApiProperty({ description: 'Investigation notes' })
  @IsString()
  @IsNotEmpty()
  investigationNotes!: string;

  @ApiProperty({ description: 'Investigator user ID' })
  @IsUUID()
  @IsNotEmpty()
  investigatedBy!: string;

  @ApiPropertyOptional({ description: 'Investigation findings', type: 'object' })
  @IsOptional()
  @IsObject()
  findings?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Evidence collected', type: 'object' })
  @IsOptional()
  @IsObject()
  evidence?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Follow-up actions required', type: 'object' })
  @IsOptional()
  @IsObject()
  followUpActions?: Record<string, any>;
}

export class AlertResolutionDto {
  @ApiProperty({ description: 'Resolution type', enum: ResolutionType })
  @IsEnum(ResolutionType)
  resolutionType!: ResolutionType;

  @ApiProperty({ description: 'Resolution notes' })
  @IsString()
  @IsNotEmpty()
  resolutionNotes!: string;

  @ApiProperty({ description: 'User ID performing the resolution' })
  @IsUUID()
  @IsNotEmpty()
  resolvedBy!: string;

  @ApiPropertyOptional({ description: 'False positive reason (if applicable)' })
  @IsOptional()
  @IsString()
  falsePositiveReason?: string;

  @ApiPropertyOptional({ description: 'SAR reference (if SAR filed)' })
  @IsOptional()
  @IsString()
  sarReference?: string;

  @ApiPropertyOptional({ description: 'Resolution metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AlertEscalationDto {
  @ApiProperty({ description: 'User ID to escalate to' })
  @IsUUID()
  @IsNotEmpty()
  escalatedTo!: string;

  @ApiProperty({ description: 'Escalation reason' })
  @IsString()
  @IsNotEmpty()
  escalationReason!: string;

  @ApiProperty({ description: 'User ID performing the escalation' })
  @IsUUID()
  @IsNotEmpty()
  escalatedBy!: string;

  @ApiPropertyOptional({ description: 'Escalation priority', enum: AlertPriority })
  @IsOptional()
  @IsEnum(AlertPriority)
  newPriority?: AlertPriority;

  @ApiPropertyOptional({ description: 'Escalation metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AlertResponseDto {
  @ApiProperty({ description: 'Alert ID' })
  id!: string;

  @ApiProperty({ description: 'Risk profile ID' })
  riskProfileId!: string;

  @ApiProperty({ description: 'Entity ID' })
  entityId!: string;

  @ApiProperty({ description: 'Alert reference number' })
  alertReference!: string;

  @ApiProperty({ description: 'Alert type', enum: AlertType })
  alertType!: AlertType;

  @ApiProperty({ description: 'Alert severity', enum: AlertSeverity })
  severity!: AlertSeverity;

  @ApiProperty({ description: 'Alert priority', enum: AlertPriority })
  priority!: AlertPriority;

  @ApiProperty({ description: 'Alert status', enum: AlertStatus })
  status!: AlertStatus;

  @ApiProperty({ description: 'Risk score (0-100)' })
  riskScore!: number;

  @ApiPropertyOptional({ description: 'Confidence level (0-100)' })
  confidenceLevel?: number;

  @ApiPropertyOptional({ description: 'Related transaction ID' })
  transactionId?: string;

  @ApiPropertyOptional({ description: 'Transaction amount' })
  transactionAmount?: number;

  @ApiPropertyOptional({ description: 'Transaction currency' })
  transactionCurrency?: string;

  @ApiProperty({ description: 'Alert data and context', type: 'object' })
  alertData!: Record<string, any>;

  @ApiProperty({ description: 'Detection rules', type: 'object' })
  detectionRules!: Record<string, any>;

  @ApiPropertyOptional({ description: 'ML features', type: 'object' })
  mlFeatures?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Investigation notes' })
  investigationNotes?: string;

  @ApiPropertyOptional({ description: 'Resolution notes' })
  resolutionNotes?: string;

  @ApiPropertyOptional({ description: 'False positive reason' })
  falsePositiveReason?: string;

  @ApiPropertyOptional({ description: 'Assigned investigator ID' })
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Assignment date' })
  assignedAt?: Date;

  @ApiPropertyOptional({ description: 'Investigator ID' })
  investigatedBy?: string;

  @ApiPropertyOptional({ description: 'Investigation date' })
  investigatedAt?: Date;

  @ApiPropertyOptional({ description: 'Resolver ID' })
  resolvedBy?: string;

  @ApiPropertyOptional({ description: 'Resolution date' })
  resolvedAt?: Date;

  @ApiPropertyOptional({ description: 'Escalated to user ID' })
  escalatedTo?: string;

  @ApiPropertyOptional({ description: 'Escalation date' })
  escalatedAt?: Date;

  @ApiProperty({ description: 'SAR filed status' })
  sarFiled!: boolean;

  @ApiPropertyOptional({ description: 'SAR reference' })
  sarReference?: string;

  @ApiPropertyOptional({ description: 'SAR filing date' })
  sarFiledAt?: Date;

  @ApiProperty({ description: 'Auto-generated flag' })
  autoGenerated!: boolean;

  @ApiPropertyOptional({ description: 'SLA due date' })
  slaDueDate?: Date;

  @ApiProperty({ description: 'SLA breached flag' })
  slaBreached!: boolean;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Related alert IDs', type: [String] })
  relatedAlerts?: string[];

  @ApiPropertyOptional({ description: 'External references', type: 'object' })
  externalReferences?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Additional metadata', type: 'object' })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class AlertDashboardDto {
  @ApiProperty({ description: 'Total number of alerts' })
  totalAlerts!: number;

  @ApiProperty({ description: 'Open alerts count' })
  openAlerts!: number;

  @ApiProperty({ description: 'In progress alerts count' })
  inProgressAlerts!: number;

  @ApiProperty({ description: 'Closed alerts count' })
  closedAlerts!: number;

  @ApiProperty({ description: 'Escalated alerts count' })
  escalatedAlerts!: number;

  @ApiProperty({ description: 'False positive alerts count' })
  falsePositiveAlerts!: number;

  @ApiProperty({ description: 'SLA breached alerts count' })
  slaBreachedAlerts!: number;

  @ApiProperty({ description: 'High priority alerts count' })
  highPriorityAlerts!: number;

  @ApiProperty({ description: 'Alerts by severity', type: 'object' })
  alertsBySeverity!: Record<string, number>;

  @ApiProperty({ description: 'Alerts by type', type: 'object' })
  alertsByType!: Record<string, number>;

  @ApiProperty({ description: 'Average resolution time in hours' })
  averageResolutionTime!: number;

  @ApiProperty({ description: 'SLA compliance percentage' })
  slaComplianceRate!: number;

  @ApiProperty({ description: 'False positive rate percentage' })
  falsePositiveRate!: number;

  @ApiProperty({ description: 'Alert trends over time', type: 'object' })
  alertTrends!: Record<string, any>;

  @ApiProperty({ description: 'Top investigators by alert count', type: 'object' })
  topInvestigators!: Record<string, any>;

  @ApiProperty({ description: 'Dashboard refresh timestamp' })
  lastUpdated!: Date;
}