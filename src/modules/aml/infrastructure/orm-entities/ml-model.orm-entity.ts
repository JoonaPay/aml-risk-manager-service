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

export enum ModelType {
  ANOMALY_DETECTION = 'ANOMALY_DETECTION',
  RISK_SCORING = 'RISK_SCORING',
  PATTERN_RECOGNITION = 'PATTERN_RECOGNITION',
  TRANSACTION_CLASSIFICATION = 'TRANSACTION_CLASSIFICATION',
  BEHAVIORAL_ANALYSIS = 'BEHAVIORAL_ANALYSIS',
  FRAUD_DETECTION = 'FRAUD_DETECTION',
  CLUSTERING = 'CLUSTERING',
  SUPERVISED_LEARNING = 'SUPERVISED_LEARNING',
  UNSUPERVISED_LEARNING = 'UNSUPERVISED_LEARNING',
  ENSEMBLE = 'ENSEMBLE',
}

export enum Algorithm {
  ISOLATION_FOREST = 'ISOLATION_FOREST',
  ONE_CLASS_SVM = 'ONE_CLASS_SVM',
  LOCAL_OUTLIER_FACTOR = 'LOCAL_OUTLIER_FACTOR',
  AUTOENCODER = 'AUTOENCODER',
  RANDOM_FOREST = 'RANDOM_FOREST',
  GRADIENT_BOOSTING = 'GRADIENT_BOOSTING',
  NEURAL_NETWORK = 'NEURAL_NETWORK',
  LOGISTIC_REGRESSION = 'LOGISTIC_REGRESSION',
  KMEANS = 'KMEANS',
  DBSCAN = 'DBSCAN',
  LSTM = 'LSTM',
  TRANSFORMER = 'TRANSFORMER',
  ENSEMBLE_VOTING = 'ENSEMBLE_VOTING',
  CUSTOM = 'CUSTOM',
}

export enum ModelStatus {
  TRAINING = 'TRAINING',
  TRAINED = 'TRAINED',
  VALIDATING = 'VALIDATING',
  VALIDATED = 'VALIDATED',
  DEPLOYED = 'DEPLOYED',
  DEPRECATED = 'DEPRECATED',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED',
}

export enum DeploymentStatus {
  NOT_DEPLOYED = 'NOT_DEPLOYED',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  CANARY = 'CANARY',
  ROLLBACK = 'ROLLBACK',
}

export enum RetrainSchedule {
  MANUAL = 'MANUAL',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum ExplainabilityMethod {
  SHAP = 'SHAP',
  LIME = 'LIME',
  PERMUTATION = 'PERMUTATION',
  FEATURE_IMPORTANCE = 'FEATURE_IMPORTANCE',
  CUSTOM = 'CUSTOM',
}

export enum ModelRiskRating {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('ml_models')
@Index(['model_name', 'version'], { unique: true })
@Index(['model_type'])
@Index(['algorithm'])
@Index(['status'])
@Index(['deployment_status'])
@Index(['champion_model'])
@Index(['challenger_model'])
@Index(['parent_model_id'])
@Index(['baseline_model_id'])
@Index(['accuracy_score'])
@Index(['drift_detected'])
@Index(['next_retrain_at'])
@Index(['compliance_approved'])
@Index(['model_risk_rating'])
@Index(['created_at'])
export class MlModelOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 200 })
  model_name!: string;

  @Column({
    type: 'enum',
    enum: ModelType,
  })
  model_type!: ModelType;

  @Column({
    type: 'enum',
    enum: Algorithm,
  })
  algorithm!: Algorithm;

  @Column('varchar', { length: 50 })
  version!: string;

  @Column('text')
  description!: string;

  @Column('text', { comment: 'Business purpose and use case' })
  purpose!: string;

  @Column('jsonb', { comment: 'Model hyperparameters and configuration' })
  model_config!: Record<string, any>;

  @Column('jsonb', { comment: 'Input features and feature engineering details' })
  features!: Record<string, any>;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Feature importance scores'
  })
  feature_importance?: Record<string, any>;

  @Column('jsonb', { comment: 'Training dataset metadata' })
  training_data!: Record<string, any>;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Validation dataset metadata'
  })
  validation_data?: Record<string, any>;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Test dataset metadata'
  })
  test_data?: Record<string, any>;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Model performance metrics (accuracy, precision, recall, etc.)'
  })
  performance_metrics?: Record<string, any>;

  @Column('jsonb', { comment: 'Serialized model and related artifacts' })
  model_artifacts!: Record<string, any>;

  @Column('varchar', { 
    length: 500, 
    nullable: true,
    comment: 'File system or cloud storage path'
  })
  model_path?: string;

  @Column('bigint', { nullable: true })
  model_size_bytes?: number;

  @Column('interval', { nullable: true })
  training_duration?: string;

  @Column('timestamp', { nullable: true })
  training_started_at?: Date;

  @Column('timestamp', { nullable: true })
  training_completed_at?: Date;

  @Column({
    type: 'enum',
    enum: ModelStatus,
    default: ModelStatus.TRAINING,
  })
  status!: ModelStatus;

  @Column({
    type: 'enum',
    enum: DeploymentStatus,
    default: DeploymentStatus.NOT_DEPLOYED,
  })
  deployment_status!: DeploymentStatus;

  @Column('timestamp', { nullable: true })
  deployed_at?: Date;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Deployment configuration and environment'
  })
  deployment_config?: Record<string, any>;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Model monitoring and alerting configuration'
  })
  monitoring_config?: Record<string, any>;

  @Column('bigint', { 
    default: 0,
    comment: 'Total number of predictions made'
  })
  prediction_count!: number;

  @Column('timestamp', { nullable: true })
  last_prediction_at?: Date;

  @Column('decimal', { precision: 5, scale: 4, nullable: true })
  accuracy_score?: number;

  @Column('decimal', { precision: 5, scale: 4, nullable: true })
  precision_score?: number;

  @Column('decimal', { precision: 5, scale: 4, nullable: true })
  recall_score?: number;

  @Column('decimal', { precision: 5, scale: 4, nullable: true })
  f1_score?: number;

  @Column('decimal', { precision: 5, scale: 4, nullable: true })
  auc_score?: number;

  @Column('boolean', { default: true })
  drift_detection_enabled!: boolean;

  @Column('decimal', { precision: 5, scale: 4, default: 0.1000 })
  drift_threshold!: number;

  @Column('timestamp', { nullable: true })
  last_drift_check?: Date;

  @Column('boolean', { default: false })
  drift_detected!: boolean;

  @Column({
    type: 'enum',
    enum: RetrainSchedule,
    default: RetrainSchedule.MONTHLY,
  })
  retrain_schedule!: RetrainSchedule;

  @Column('boolean', { default: false })
  auto_retrain!: boolean;

  @Column('timestamp', { nullable: true })
  last_retrain_at?: Date;

  @Column('timestamp', { nullable: true })
  next_retrain_at?: Date;

  @Column('uuid', { 
    nullable: true,
    comment: 'Previous version of the model'
  })
  parent_model_id?: string;

  @Column('uuid', { 
    nullable: true,
    comment: 'Baseline model for comparison'
  })
  baseline_model_id?: string;

  @Column('boolean', { 
    default: false,
    comment: 'Current production champion model'
  })
  champion_model!: boolean;

  @Column('boolean', { 
    default: false,
    comment: 'Challenger model being tested'
  })
  challenger_model!: boolean;

  @Column('jsonb', { 
    nullable: true,
    comment: 'A/B testing configuration'
  })
  a_b_test_config?: Record<string, any>;

  @Column('boolean', { default: true })
  explainability_enabled!: boolean;

  @Column({
    type: 'enum',
    enum: ExplainabilityMethod,
    nullable: true,
  })
  explainability_method?: ExplainabilityMethod;

  @Column('boolean', { default: false })
  compliance_approved!: boolean;

  @Column('text', { nullable: true })
  compliance_notes?: string;

  @Column({
    type: 'enum',
    enum: ModelRiskRating,
    default: ModelRiskRating.MEDIUM,
  })
  model_risk_rating!: ModelRiskRating;

  @Column('jsonb', { 
    nullable: true,
    comment: 'Model categorization tags'
  })
  tags?: string[];

  @Column('uuid', { comment: 'User ID of creator' })
  created_by!: string;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of last updater'
  })
  updated_by?: string;

  @Column('uuid', { 
    nullable: true,
    comment: 'User ID of approver'
  })
  approved_by?: string;

  @Column('timestamp', { nullable: true })
  approved_at?: Date;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => MlModelOrmEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_model_id' })
  parentModel?: MlModelOrmEntity;

  @ManyToOne(() => MlModelOrmEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'baseline_model_id' })
  baselineModel?: MlModelOrmEntity;
}