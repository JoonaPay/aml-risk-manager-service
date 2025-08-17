import {
  Controller,
  Get,
  Post,
  Put,
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
import { MLRiskScoringService } from '../domain/services/ml-risk-scoring.service';
import { 
  MLScoreRequestDto,
  MLScoreResponseDto,
  MLModelTrainingRequestDto,
  MLModelResponseDto,
  MLModelQueryDto,
  ModelPerformanceDto,
  FeatureImportanceDto,
  AnomalyDetectionRequestDto,
  AnomalyDetectionResponseDto,
  ModelComparisonDto,
} from '../dto/requests/ml.dto';

@ApiTags('ML Risk Scoring')
@ApiBearerAuth()
@Controller('api/v1/ml')
export class MLController {
  private readonly logger = new Logger(MLController.name);

  constructor(
    private readonly mlRiskScoringService: MLRiskScoringService,
  ) {}

  @Post('score')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate ML-based risk score for entity or transaction' })
  @ApiResponse({
    status: 200,
    description: 'ML risk score calculated successfully',
    type: MLScoreResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async calculateRiskScore(@Body() scoreRequest: MLScoreRequestDto): Promise<MLScoreResponseDto> {
    try {
      this.logger.log(`Calculating ML risk score for entity: ${scoreRequest.entityId}`);

      const mlScore = await this.mlRiskScoringService.calculateRiskScore(scoreRequest);

      this.logger.log(`ML risk score calculated: ${mlScore.prediction}`);
      return mlScore;
    } catch (error) {
      this.logger.error(`Failed to calculate ML risk score: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to calculate ML risk score');
    }
  }

  @Post('anomaly-detection')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detect anomalies using ML models' })
  @ApiResponse({
    status: 200,
    description: 'Anomaly detection completed',
    type: AnomalyDetectionResponseDto,
  })
  async detectAnomalies(
    @Body() detectionRequest: AnomalyDetectionRequestDto,
  ): Promise<AnomalyDetectionResponseDto> {
    try {
      this.logger.log(`Running anomaly detection for entity: ${detectionRequest.entityId}`);

      const anomalies = await this.mlRiskScoringService.detectAnomalies(detectionRequest);

      this.logger.log(`Anomaly detection completed. Found ${anomalies.anomalies.length} anomalies`);
      return anomalies;
    } catch (error) {
      this.logger.error(`Failed to detect anomalies: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to detect anomalies');
    }
  }

  @Post('train')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Train a new ML model' })
  @ApiResponse({
    status: 202,
    description: 'Model training started',
    type: MLModelResponseDto,
  })
  async trainModel(@Body() trainingRequest: MLModelTrainingRequestDto): Promise<MLModelResponseDto> {
    try {
      this.logger.log(`Starting model training: ${trainingRequest.modelName}`);

      const model = await this.mlRiskScoringService.trainModel(trainingRequest);

      this.logger.log(`Model training started with ID: ${model.id}`);
      return this.mapToModelResponseDto(model);
    } catch (error) {
      this.logger.error(`Failed to start model training: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to start model training');
    }
  }

  @Get('models')
  @ApiOperation({ summary: 'Get all ML models' })
  @ApiResponse({
    status: 200,
    description: 'List of ML models',
    type: [MLModelResponseDto],
  })
  async getModels(
    @Query() query: MLModelQueryDto,
  ): Promise<{ data: MLModelResponseDto[]; total: number; page: number; limit: number }> {
    try {
      this.logger.log('Retrieving ML models', query);

      const result = await this.mlRiskScoringService.getModels(query);

      return {
        data: result.data.map(model => this.mapToModelResponseDto(model)),
        total: result.total,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve ML models: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve ML models');
    }
  }

  @Get('models/:id')
  @ApiOperation({ summary: 'Get ML model by ID' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({
    status: 200,
    description: 'ML model details',
    type: MLModelResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Model not found' })
  async getModel(@Param('id') id: string): Promise<MLModelResponseDto> {
    try {
      this.logger.log(`Retrieving ML model: ${id}`);

      const model = await this.mlRiskScoringService.getModelById(id);
      if (!model) {
        throw new NotFoundException(`ML model with ID ${id} not found`);
      }

      return this.mapToModelResponseDto(model);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve ML model: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve ML model');
    }
  }

  @Put('models/:id/deploy')
  @ApiOperation({ summary: 'Deploy ML model to production' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({
    status: 200,
    description: 'Model deployed successfully',
    type: MLModelResponseDto,
  })
  async deployModel(
    @Param('id') id: string,
    @Body() deploymentConfig?: { environment: string; rolloutPercentage?: number },
  ): Promise<MLModelResponseDto> {
    try {
      this.logger.log(`Deploying ML model: ${id}`);

      const model = await this.mlRiskScoringService.deployModel(id, deploymentConfig);

      this.logger.log(`Model deployed: ${id}`);
      return this.mapToModelResponseDto(model);
    } catch (error) {
      this.logger.error(`Failed to deploy ML model: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`ML model with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to deploy ML model');
    }
  }

  @Get('models/:id/performance')
  @ApiOperation({ summary: 'Get model performance metrics' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({
    status: 200,
    description: 'Model performance metrics',
    type: ModelPerformanceDto,
  })
  async getModelPerformance(@Param('id') id: string): Promise<ModelPerformanceDto> {
    try {
      this.logger.log(`Retrieving model performance: ${id}`);

      const performance = await this.mlRiskScoringService.getModelPerformance(id);

      return performance;
    } catch (error) {
      this.logger.error(`Failed to retrieve model performance: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`ML model with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to retrieve model performance');
    }
  }

  @Get('models/:id/feature-importance')
  @ApiOperation({ summary: 'Get model feature importance' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({
    status: 200,
    description: 'Model feature importance',
    type: FeatureImportanceDto,
  })
  async getFeatureImportance(@Param('id') id: string): Promise<FeatureImportanceDto> {
    try {
      this.logger.log(`Retrieving feature importance for model: ${id}`);

      const importance = await this.mlRiskScoringService.getFeatureImportance(id);

      return importance;
    } catch (error) {
      this.logger.error(`Failed to retrieve feature importance: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`ML model with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to retrieve feature importance');
    }
  }

  @Post('models/:id/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate ML model performance' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({
    status: 200,
    description: 'Model validation completed',
    type: ModelPerformanceDto,
  })
  async validateModel(
    @Param('id') id: string,
    @Body() validationConfig?: { testDatasetId?: string; validationMetrics?: string[] },
  ): Promise<ModelPerformanceDto> {
    try {
      this.logger.log(`Validating ML model: ${id}`);

      const validation = await this.mlRiskScoringService.validateModel(id, validationConfig);

      this.logger.log(`Model validation completed: ${id}`);
      return validation;
    } catch (error) {
      this.logger.error(`Failed to validate ML model: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`ML model with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to validate ML model');
    }
  }

  @Post('models/compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Compare multiple ML models' })
  @ApiResponse({
    status: 200,
    description: 'Model comparison completed',
    type: ModelComparisonDto,
  })
  async compareModels(
    @Body() comparisonRequest: { modelIds: string[]; metrics: string[] },
  ): Promise<ModelComparisonDto> {
    try {
      this.logger.log(`Comparing ML models: ${comparisonRequest.modelIds.join(', ')}`);

      const comparison = await this.mlRiskScoringService.compareModels(
        comparisonRequest.modelIds,
        comparisonRequest.metrics,
      );

      return comparison;
    } catch (error) {
      this.logger.error(`Failed to compare ML models: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to compare ML models');
    }
  }

  @Get('models/champion/:modelType')
  @ApiOperation({ summary: 'Get champion model for a specific type' })
  @ApiParam({ name: 'modelType', description: 'Model type' })
  @ApiResponse({
    status: 200,
    description: 'Champion model details',
    type: MLModelResponseDto,
  })
  async getChampionModel(@Param('modelType') modelType: string): Promise<MLModelResponseDto> {
    try {
      this.logger.log(`Retrieving champion model for type: ${modelType}`);

      const model = await this.mlRiskScoringService.getChampionModel(modelType);
      if (!model) {
        throw new NotFoundException(`No champion model found for type: ${modelType}`);
      }

      return this.mapToModelResponseDto(model);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve champion model: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve champion model');
    }
  }

  @Post('models/:id/drift-detection')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check for model drift' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiResponse({
    status: 200,
    description: 'Drift detection completed',
    type: 'object',
  })
  async checkModelDrift(
    @Param('id') id: string,
    @Body() driftConfig?: { datasetId?: string; threshold?: number },
  ): Promise<any> {
    try {
      this.logger.log(`Checking model drift for: ${id}`);

      const driftResult = await this.mlRiskScoringService.checkModelDrift(id, driftConfig);

      return driftResult;
    } catch (error) {
      this.logger.error(`Failed to check model drift: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`ML model with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to check model drift');
    }
  }

  @Get('models/:id/predictions')
  @ApiOperation({ summary: 'Get model prediction history' })
  @ApiParam({ name: 'id', description: 'Model ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of predictions to return' })
  @ApiResponse({
    status: 200,
    description: 'Model prediction history',
    type: 'object',
  })
  async getModelPredictions(
    @Param('id') id: string,
    @Query('limit') limit: number = 100,
  ): Promise<any> {
    try {
      this.logger.log(`Retrieving prediction history for model: ${id}`);

      const predictions = await this.mlRiskScoringService.getModelPredictions(id, limit);

      return predictions;
    } catch (error) {
      this.logger.error(`Failed to retrieve model predictions: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve model predictions');
    }
  }

  @Post('batch-score')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Batch score multiple entities' })
  @ApiResponse({
    status: 200,
    description: 'Batch scoring completed',
    type: 'object',
  })
  async batchScore(
    @Body() batchRequest: { entityIds: string[]; modelId?: string },
  ): Promise<{ results: MLScoreResponseDto[]; summary: any }> {
    try {
      this.logger.log(`Batch scoring ${batchRequest.entityIds.length} entities`);

      const results = await this.mlRiskScoringService.batchScore(
        batchRequest.entityIds,
        batchRequest.modelId,
      );

      return results;
    } catch (error) {
      this.logger.error(`Failed to perform batch scoring: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to perform batch scoring');
    }
  }

  private mapToModelResponseDto(model: any): MLModelResponseDto {
    return {
      id: model.id,
      modelName: model.model_name,
      modelType: model.model_type,
      algorithm: model.algorithm,
      version: model.version,
      description: model.description,
      purpose: model.purpose,
      status: model.status,
      deploymentStatus: model.deployment_status,
      championModel: model.champion_model,
      challengerModel: model.challenger_model,
      accuracyScore: model.accuracy_score,
      precisionScore: model.precision_score,
      recallScore: model.recall_score,
      f1Score: model.f1_score,
      aucScore: model.auc_score,
      driftDetected: model.drift_detected,
      predictionCount: model.prediction_count,
      lastPredictionAt: model.last_prediction_at,
      trainingStartedAt: model.training_started_at,
      trainingCompletedAt: model.training_completed_at,
      deployedAt: model.deployed_at,
      complianceApproved: model.compliance_approved,
      modelRiskRating: model.model_risk_rating,
      tags: model.tags,
      createdBy: model.created_by,
      createdAt: model.created_at,
      updatedAt: model.updated_at,
    };
  }
}