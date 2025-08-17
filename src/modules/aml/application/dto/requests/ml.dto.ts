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
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export enum EntityType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export class MLScoreRequestDto {
  @ApiProperty({ description: 'Entity ID to score' })
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ description: 'Entity type', enum: EntityType })
  @IsEnum(EntityType)
  entityType!: EntityType;

  @ApiProperty({ description: 'Risk factors for scoring', type: 'object' })
  @IsObject()
  riskFactors!: Record<string, any>;

  @ApiProperty({ description: 'Transaction behavior data', type: 'object' })
  @IsObject()
  transactionBehavior!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Specific model ID to use' })
  @IsOptional()
  @IsUUID()
  modelId?: string;

  @ApiPropertyOptional({ description: 'Model type to use if no specific model ID', enum: ModelType })
  @IsOptional()
  @IsEnum(ModelType)
  modelType?: ModelType;

  @ApiPropertyOptional({ description: 'Additional features for scoring', type: 'object' })
  @IsOptional()
  @IsObject()
  additionalFeatures?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Enable explainability' })
  @IsOptional()
  @IsBoolean()
  enableExplainability?: boolean;

  @ApiPropertyOptional({ description: 'Historical transaction data for context', type: 'object' })
  @IsOptional()
  @IsObject()
  historicalData?: Record<string, any>;
}

export class AnomalyDetectionRequestDto {
  @ApiProperty({ description: 'Entity ID to analyze' })
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ description: 'Data points for anomaly detection', type: 'object' })
  @IsObject()
  dataPoints!: Record<string, any>[];

  @ApiPropertyOptional({ description: 'Anomaly threshold (0-1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number;

  @ApiPropertyOptional({ description: 'Time window for analysis' })
  @IsOptional()
  @IsString()
  timeWindow?: string;

  @ApiPropertyOptional({ description: 'Specific anomaly detection model ID' })
  @IsOptional()
  @IsUUID()
  modelId?: string;

  @ApiPropertyOptional({ description: 'Analysis context', type: 'object' })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class MLModelTrainingRequestDto {
  @ApiProperty({ description: 'Model name' })
  @IsString()
  @IsNotEmpty()
  modelName!: string;

  @ApiProperty({ description: 'Model type', enum: ModelType })
  @IsEnum(ModelType)
  modelType!: ModelType;

  @ApiProperty({ description: 'Algorithm to use', enum: Algorithm })
  @IsEnum(Algorithm)
  algorithm!: Algorithm;

  @ApiProperty({ description: 'Model description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Business purpose of the model' })
  @IsString()
  @IsNotEmpty()
  purpose!: string;

  @ApiProperty({ description: 'Model configuration and hyperparameters', type: 'object' })
  @IsObject()
  modelConfig!: Record<string, any>;

  @ApiProperty({ description: 'Feature definitions', type: 'object' })
  @IsObject()
  features!: Record<string, any>;

  @ApiProperty({ description: 'Training dataset metadata', type: 'object' })
  @IsObject()
  trainingData!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Validation dataset metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  validationData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Test dataset metadata', type: 'object' })
  @IsOptional()
  @IsObject()
  testData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Parent model ID for versioning' })
  @IsOptional()
  @IsUUID()
  parentModelId?: string;

  @ApiPropertyOptional({ description: 'Model tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Creator user ID' })
  @IsUUID()
  @IsNotEmpty()
  createdBy!: string;
}

export class MLModelQueryDto {
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

  @ApiPropertyOptional({ description: 'Filter by model type', enum: ModelType })
  @IsOptional()
  @IsEnum(ModelType)
  modelType?: ModelType;

  @ApiPropertyOptional({ description: 'Filter by algorithm', enum: Algorithm })
  @IsOptional()
  @IsEnum(Algorithm)
  algorithm?: Algorithm;

  @ApiPropertyOptional({ description: 'Filter by status', enum: ModelStatus })
  @IsOptional()
  @IsEnum(ModelStatus)
  status?: ModelStatus;

  @ApiPropertyOptional({ description: 'Filter by deployment status', enum: DeploymentStatus })
  @IsOptional()
  @IsEnum(DeploymentStatus)
  deploymentStatus?: DeploymentStatus;

  @ApiPropertyOptional({ description: 'Filter champion models only' })
  @IsOptional()
  @IsBoolean()
  championOnly?: boolean;

  @ApiPropertyOptional({ description: 'Filter by minimum accuracy score' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  minAccuracy?: number;

  @ApiPropertyOptional({ description: 'Search in model name and description' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class MLScoreResponseDto {
  @ApiProperty({ description: 'Entity ID that was scored' })
  entityId!: string;

  @ApiProperty({ description: 'Model ID used for scoring' })
  modelId!: string;

  @ApiProperty({ description: 'Model version' })
  modelVersion!: string;

  @ApiProperty({ description: 'Risk prediction score (0-1)' })
  prediction!: number;

  @ApiProperty({ description: 'Prediction confidence (0-1)' })
  confidence!: number;

  @ApiProperty({ description: 'Features used in prediction', type: 'object' })
  features!: Record<string, number>;

  @ApiPropertyOptional({ description: 'Model explainability data', type: 'object' })
  explainability?: {
    topFeatures: Array<{
      feature: string;
      importance: number;
      value: number;
    }>;
    shapValues?: Record<string, number>;
    localExplanation?: string;
  };

  @ApiProperty({ description: 'Scoring timestamp' })
  scoredAt!: Date;

  @ApiProperty({ description: 'Processing time in milliseconds' })
  processingTimeMs!: number;

  @ApiPropertyOptional({ description: 'Model metadata used for scoring', type: 'object' })
  modelMetadata?: Record<string, any>;
}

export class AnomalyDetectionResponseDto {
  @ApiProperty({ description: 'Entity ID analyzed' })
  entityId!: string;

  @ApiProperty({ description: 'Model ID used for detection' })
  modelId!: string;

  @ApiProperty({ description: 'Overall anomaly score (0-1)' })
  overallAnomalyScore!: number;

  @ApiProperty({ description: 'Detected anomalies', type: 'object' })
  anomalies!: Array<{
    dataPoint: Record<string, any>;
    anomalyScore: number;
    anomalyType: string;
    explanation: string;
  }>;

  @ApiProperty({ description: 'Analysis summary', type: 'object' })
  summary!: {
    totalDataPoints: number;
    anomalousDataPoints: number;
    anomalyRate: number;
    severityDistribution: Record<string, number>;
  };

  @ApiProperty({ description: 'Detection timestamp' })
  detectedAt!: Date;

  @ApiPropertyOptional({ description: 'Recommended actions', type: [String] })
  recommendations?: string[];
}

export class MLModelResponseDto {
  @ApiProperty({ description: 'Model ID' })
  id!: string;

  @ApiProperty({ description: 'Model name' })
  modelName!: string;

  @ApiProperty({ description: 'Model type', enum: ModelType })
  modelType!: ModelType;

  @ApiProperty({ description: 'Algorithm used', enum: Algorithm })
  algorithm!: Algorithm;

  @ApiProperty({ description: 'Model version' })
  version!: string;

  @ApiProperty({ description: 'Model description' })
  description!: string;

  @ApiProperty({ description: 'Business purpose' })
  purpose!: string;

  @ApiProperty({ description: 'Model status', enum: ModelStatus })
  status!: ModelStatus;

  @ApiProperty({ description: 'Deployment status', enum: DeploymentStatus })
  deploymentStatus!: DeploymentStatus;

  @ApiProperty({ description: 'Is champion model' })
  championModel!: boolean;

  @ApiProperty({ description: 'Is challenger model' })
  challengerModel!: boolean;

  @ApiPropertyOptional({ description: 'Accuracy score' })
  accuracyScore?: number;

  @ApiPropertyOptional({ description: 'Precision score' })
  precisionScore?: number;

  @ApiPropertyOptional({ description: 'Recall score' })
  recallScore?: number;

  @ApiPropertyOptional({ description: 'F1 score' })
  f1Score?: number;

  @ApiPropertyOptional({ description: 'AUC score' })
  aucScore?: number;

  @ApiProperty({ description: 'Drift detected flag' })
  driftDetected!: boolean;

  @ApiProperty({ description: 'Total prediction count' })
  predictionCount!: number;

  @ApiPropertyOptional({ description: 'Last prediction timestamp' })
  lastPredictionAt?: Date;

  @ApiPropertyOptional({ description: 'Training start timestamp' })
  trainingStartedAt?: Date;

  @ApiPropertyOptional({ description: 'Training completion timestamp' })
  trainingCompletedAt?: Date;

  @ApiPropertyOptional({ description: 'Deployment timestamp' })
  deployedAt?: Date;

  @ApiProperty({ description: 'Compliance approval status' })
  complianceApproved!: boolean;

  @ApiProperty({ description: 'Model risk rating' })
  modelRiskRating!: string;

  @ApiPropertyOptional({ description: 'Model tags', type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Creator user ID' })
  createdBy!: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}

export class ModelPerformanceDto {
  @ApiProperty({ description: 'Model ID' })
  modelId!: string;

  @ApiProperty({ description: 'Performance metrics', type: 'object' })
  metrics!: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    aucScore: number;
    specificity: number;
    sensitivity: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
  };

  @ApiProperty({ description: 'Confusion matrix', type: 'object' })
  confusionMatrix!: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };

  @ApiProperty({ description: 'ROC curve data', type: 'object' })
  rocCurve!: {
    fpr: number[];
    tpr: number[];
    thresholds: number[];
  };

  @ApiProperty({ description: 'Precision-Recall curve data', type: 'object' })
  prCurve!: {
    precision: number[];
    recall: number[];
    thresholds: number[];
  };

  @ApiProperty({ description: 'Performance over time', type: 'object' })
  performanceOverTime!: Array<{
    date: Date;
    accuracy: number;
    precision: number;
    recall: number;
  }>;

  @ApiProperty({ description: 'Benchmark comparison', type: 'object' })
  benchmark!: {
    baselineAccuracy: number;
    improvementPercentage: number;
    industryAverage?: number;
  };

  @ApiProperty({ description: 'Evaluation timestamp' })
  evaluatedAt!: Date;
}

export class FeatureImportanceDto {
  @ApiProperty({ description: 'Model ID' })
  modelId!: string;

  @ApiProperty({ description: 'Feature importance scores', type: 'object' })
  featureImportance!: Array<{
    feature: string;
    importance: number;
    rank: number;
    description?: string;
  }>;

  @ApiProperty({ description: 'Global feature statistics', type: 'object' })
  globalStats!: {
    totalFeatures: number;
    topFeaturesCoverage: number; // Coverage of top 10 features
    featureStability: number; // How stable feature importance is over time
  };

  @ApiProperty({ description: 'Feature correlation matrix', type: 'object' })
  correlationMatrix?: Record<string, Record<string, number>>;

  @ApiProperty({ description: 'SHAP values summary', type: 'object' })
  shapSummary?: {
    meanAbsShapValues: Record<string, number>;
    featureInteractions: Array<{
      feature1: string;
      feature2: string;
      interactionStrength: number;
    }>;
  };

  @ApiProperty({ description: 'Calculation timestamp' })
  calculatedAt!: Date;
}

export class ModelComparisonDto {
  @ApiProperty({ description: 'Compared model IDs', type: [String] })
  modelIds!: string[];

  @ApiProperty({ description: 'Comparison metrics', type: 'object' })
  comparison!: Array<{
    modelId: string;
    modelName: string;
    metrics: Record<string, number>;
    rank: number;
  }>;

  @ApiProperty({ description: 'Statistical significance tests', type: 'object' })
  statisticalTests!: {
    mcNemarTest?: {
      statistic: number;
      pValue: number;
      significant: boolean;
    };
    pairedTTest?: {
      statistic: number;
      pValue: number;
      significant: boolean;
    };
  };

  @ApiProperty({ description: 'Recommendation for model selection', type: 'object' })
  recommendation!: {
    bestModelId: string;
    reason: string;
    confidenceLevel: number;
    alternativeModels?: string[];
  };

  @ApiProperty({ description: 'Comparison timestamp' })
  comparedAt!: Date;
}