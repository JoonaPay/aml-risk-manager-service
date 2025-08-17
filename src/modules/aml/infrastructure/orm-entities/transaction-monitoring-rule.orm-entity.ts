import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum RuleType {
  AMOUNT_THRESHOLD = 'AMOUNT_THRESHOLD',
  VELOCITY_CHECK = 'VELOCITY_CHECK',
  PATTERN_DETECTION = 'PATTERN_DETECTION',
  GEOGRAPHIC_ANOMALY = 'GEOGRAPHIC_ANOMALY',
  TIME_BASED = 'TIME_BASED',
  FREQUENCY_CHECK = 'FREQUENCY_CHECK',
  CONCENTRATION_RISK = 'CONCENTRATION_RISK',
  STRUCTURING_DETECTION = 'STRUCTURING_DETECTION',
  ROUND_DOLLAR_AMOUNT = 'ROUND_DOLLAR_AMOUNT',
  DORMANT_ACCOUNT = 'DORMANT_ACCOUNT',
  CASH_INTENSIVE = 'CASH_INTENSIVE',
  RAPID_MOVEMENT = 'RAPID_MOVEMENT',
  HIGH_RISK_COUNTRY = 'HIGH_RISK_COUNTRY',
  PEP_TRANSACTION = 'PEP_TRANSACTION',
  ML_ANOMALY = 'ML_ANOMALY',
}

export enum AggregationLevel {
  TRANSACTION = 'TRANSACTION',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum ReviewSchedule {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY',
}

@Entity('transaction_monitoring_rules')
@Index(['rule_name'])
@Index(['rule_code'])
@Index(['rule_type'])
@Index(['is_active'])
@Index(['is_system_rule'])
@Index(['effectiveness_score'])
@Index(['last_triggered'])
@Index(['parent_rule_id'])
@Index(['ml_model_id'])
@Index(['next_review_date'])
@Index(['created_at'])
export class TransactionMonitoringRuleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 200, unique: true })
  rule_name!: string;

  @Column('varchar', { length: 50, unique: true })
  rule_code!: string;

  @Column({
    type: 'enum',
    enum: RuleType,
  })
  rule_type!: RuleType;

  @Column('text')
  description!: string;

  @Column('jsonb', { comment: 'Rule conditions and logic' })
  rule_logic!: Record<string, any>;

  @Column('jsonb', { comment: 'Rule parameters and thresholds' })
  parameters!: Record<string, any>;

  @Column('decimal', { 
    precision: 5, 
    scale: 2, 
    default: 50.00,
    comment: 'Weight in overall risk calculation'
  })
  risk_weight!: number;

  @Column('jsonb', { comment: 'Risk score to severity mapping' })
  severity_mapping!: Record<string, any>;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Applicable customer segments'
  })
  customer_segments?: string[];

  @Column('jsonb', { 
    nullable: true,
    comment: 'Applicable product types'
  })
  product_types?: string[];

  @Column('jsonb', { 
    nullable: true,
    comment: 'Geographic application scope'
  })
  geographic_scope?: Record<string, any>;

  @Column('interval', { 
    nullable: true,
    comment: 'Time window for rule evaluation'
  })
  time_window?: string;

  @Column('interval', { 
    nullable: true,
    comment: 'Historical data lookback period'
  })
  lookback_period?: string;

  @Column({
    type: 'enum',
    enum: AggregationLevel,
    default: AggregationLevel.TRANSACTION,
  })
  aggregation_level!: AggregationLevel;

  @Column('decimal', { precision: 5, scale: 2, default: 75.00 })
  alert_threshold!: number;

  @Column('boolean', { default: true })
  auto_alert!: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 90.00 })
  escalation_threshold!: number;

  @Column('boolean', { default: false })
  auto_escalate!: boolean;

  @Column('decimal', { 
    precision: 5, 
    scale: 2, 
    default: 20.00,
    comment: 'Threshold below which alerts are likely false positives'
  })
  false_positive_threshold!: number;

  @Column('boolean', { default: true })
  is_active!: boolean;

  @Column('boolean', { 
    default: false,
    comment: 'System rules cannot be deleted'
  })
  is_system_rule!: boolean;

  @Column('decimal', { 
    precision: 5, 
    scale: 2, 
    nullable: true,
    comment: 'Rule effectiveness based on hit rate'
  })
  effectiveness_score?: number;

  @Column('decimal', { 
    precision: 5, 
    scale: 2, 
    nullable: true,
    comment: 'Percentage of alerts that are true positives'
  })
  hit_rate?: number;

  @Column('timestamp', { nullable: true })
  last_triggered?: Date;

  @Column('integer', { default: 0 })
  trigger_count!: number;

  @Column('integer', { default: 0 })
  true_positive_count!: number;

  @Column('integer', { default: 0 })
  false_positive_count!: number;

  @Column('integer', { 
    default: 1,
    comment: 'Rule version for tracking changes'
  })
  version!: number;

  @Column('uuid', { 
    nullable: true,
    comment: 'Reference to parent rule if this is a version'
  })
  parent_rule_id?: string;

  @Column('uuid', { 
    nullable: true,
    comment: 'Associated ML model if applicable'
  })
  ml_model_id?: string;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Rule categorization tags'
  })
  tags?: string[];

  @Column({
    type: 'enum',
    enum: ReviewSchedule,
    default: ReviewSchedule.QUARTERLY,
  })
  review_schedule!: ReviewSchedule;

  @Column('timestamp', { nullable: true })
  last_reviewed?: Date;

  @Column('timestamp', { nullable: true })
  next_review_date?: Date;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of last reviewer'
  })
  reviewed_by?: string;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of approver'
  })
  approved_by?: string;

  @Column('timestamp', { nullable: true })
  approved_at?: Date;

  @Column('uuid', { comment: 'User ID of creator' })
  created_by!: string;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of last updater'
  })
  updated_by?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}