import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

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

@Entity('risk_profiles')
@Index(['entity_id'], { unique: true })
@Index(['entity_type'])
@Index(['risk_level'])
@Index(['overall_risk_score'])
@Index(['customer_type'])
@Index(['pep_status'])
@Index(['sanctions_hit'])
@Index(['regulatory_status'])
@Index(['next_assessment_date'])
@Index(['monitoring_enabled'])
@Index(['created_at'])
export class RiskProfileOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { comment: 'User ID or Business ID' })
  entity_id!: string;

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  entity_type!: EntityType;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.MEDIUM,
  })
  risk_level!: RiskLevel;

  @Column('decimal', { precision: 5, scale: 2, default: 50.00 })
  overall_risk_score!: number;

  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.RETAIL,
  })
  customer_type!: CustomerType;

  @Column('varchar', { length: 100, nullable: true })
  customer_segment?: string;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.MEDIUM,
  })
  geographic_risk!: RiskLevel;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.MEDIUM,
  })
  product_risk!: RiskLevel;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.MEDIUM,
  })
  channel_risk!: RiskLevel;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
  })
  occupation_risk?: RiskLevel;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
  })
  industry_risk?: RiskLevel;

  @Column('boolean', { 
    default: false, 
    comment: 'Politically Exposed Person'
  })
  pep_status!: boolean;

  @Column('boolean', { default: false })
  sanctions_hit!: boolean;

  @Column('boolean', { default: false })
  adverse_media!: boolean;

  @Column('jsonb', { comment: 'Detailed risk factor breakdown' })
  risk_factors!: Record<string, any>;

  @Column('jsonb', { comment: 'Transaction patterns and behaviors' })
  transaction_behavior!: Record<string, any>;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Machine learning risk scoring results'
  })
  ml_risk_scoring?: Record<string, any>;

  @Column('varchar', { length: 3, nullable: true })
  country_of_residence?: string;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Array of countries for business operations'
  })
  countries_of_operation?: string[];

  @Column({
    type: 'enum',
    enum: RegulatoryStatus,
    default: RegulatoryStatus.UNDER_REVIEW,
  })
  regulatory_status!: RegulatoryStatus;

  @Column({
    type: 'enum',
    enum: DueDiligenceLevel,
    default: DueDiligenceLevel.BASIC,
  })
  due_diligence_level!: DueDiligenceLevel;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  last_assessment_date!: Date;

  @Column('timestamp', { nullable: true })
  next_assessment_date?: Date;

  @Column({
    type: 'enum',
    enum: AssessmentFrequency,
    default: AssessmentFrequency.QUARTERLY,
  })
  assessment_frequency!: AssessmentFrequency;

  @Column('decimal', { precision: 5, scale: 2, default: 75.00 })
  risk_appetite_threshold!: number;

  @Column('boolean', { default: true })
  monitoring_enabled!: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 80.00 })
  alert_threshold!: number;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('uuid', { nullable: true, comment: 'User ID of assessor' })
  assessed_by?: string;

  @Column('uuid', { nullable: true, comment: 'User ID of approver' })
  approved_by?: string;

  @Column('timestamp', { nullable: true })
  approved_at?: Date;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}