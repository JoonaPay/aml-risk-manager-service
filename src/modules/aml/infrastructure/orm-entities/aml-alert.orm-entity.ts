import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RiskProfileOrmEntity } from './risk-profile.orm-entity';

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

@Entity('aml_alerts')
@Index(['risk_profile_id'])
@Index(['entity_id'])
@Index(['alert_reference'])
@Index(['alert_type'])
@Index(['severity'])
@Index(['priority'])
@Index(['status'])
@Index(['risk_score'])
@Index(['transaction_id'])
@Index(['assigned_to'])
@Index(['sar_filed'])
@Index(['auto_generated'])
@Index(['sla_due_date'])
@Index(['sla_breached'])
@Index(['created_at'])
export class AmlAlertOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  risk_profile_id!: string;

  @Column('uuid', { comment: 'User ID or Business ID' })
  entity_id!: string;

  @Column('varchar', { length: 100, unique: true })
  alert_reference!: string;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  alert_type!: AlertType;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
    default: AlertSeverity.MEDIUM,
  })
  severity!: AlertSeverity;

  @Column({
    type: 'enum',
    enum: AlertPriority,
    default: AlertPriority.NORMAL,
  })
  priority!: AlertPriority;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.OPEN,
  })
  status!: AlertStatus;

  @Column('decimal', { precision: 5, scale: 2 })
  risk_score!: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  confidence_level?: number;

  @Column('uuid', { 
    nullable: true,
    comment: 'Related transaction ID if applicable'
  })
  transaction_id?: string;

  @Column('decimal', { precision: 19, scale: 4, nullable: true })
  transaction_amount?: number;

  @Column('varchar', { length: 3, nullable: true })
  transaction_currency?: string;

  @Column('jsonb', { comment: 'Detailed alert information and context' })
  alert_data!: Record<string, any>;

  @Column('jsonb', { comment: 'Rules that triggered this alert' })
  detection_rules!: Record<string, any>;

  @Column('jsonb', { 
    nullable: true,
    comment: 'ML model features and outputs'
  })
  ml_features?: Record<string, any>;

  @Column('text', { nullable: true })
  investigation_notes?: string;

  @Column('text', { nullable: true })
  resolution_notes?: string;

  @Column('text', { nullable: true })
  false_positive_reason?: string;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of assigned investigator'
  })
  assigned_to?: string;

  @Column('timestamp', { nullable: true })
  assigned_at?: Date;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of investigator'
  })
  investigated_by?: string;

  @Column('timestamp', { nullable: true })
  investigated_at?: Date;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of resolver'
  })
  resolved_by?: string;

  @Column('timestamp', { nullable: true })
  resolved_at?: Date;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of escalation recipient'
  })
  escalated_to?: string;

  @Column('timestamp', { nullable: true })
  escalated_at?: Date;

  @Column('boolean', { 
    default: false,
    comment: 'Suspicious Activity Report filed'
  })
  sar_filed!: boolean;

  @Column('varchar', { length: 100, nullable: true })
  sar_reference?: string;

  @Column('timestamp', { nullable: true })
  sar_filed_at?: Date;

  @Column('boolean', { default: true })
  auto_generated!: boolean;

  @Column('timestamp', { nullable: true })
  sla_due_date?: Date;

  @Column('boolean', { default: false })
  sla_breached!: boolean;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Array of tags for categorization'
  })
  tags?: string[];

  @Column('jsonb', { 
    nullable: true,
    comment: 'Array of related alert IDs'
  })
  related_alerts?: string[];

  @Column('jsonb', { 
    nullable: true,
    comment: 'External system references'
  })
  external_references?: Record<string, any>;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => RiskProfileOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'risk_profile_id' })
  riskProfile!: RiskProfileOrmEntity;
}