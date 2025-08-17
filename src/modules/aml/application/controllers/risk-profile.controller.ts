import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { RiskAssessmentService } from '../domain/services/risk-assessment.service';
import { MLRiskScoringService } from '../domain/services/ml-risk-scoring.service';
import { 
  CreateRiskProfileDto,
  UpdateRiskProfileDto,
  RiskProfileResponseDto,
  RiskAssessmentRequestDto,
  RiskAssessmentResponseDto,
  RiskProfileQueryDto,
} from '../dto/requests';

@ApiTags('Risk Profiles')
@ApiBearerAuth()
@Controller('api/v1/risk-profiles')
export class RiskProfileController {
  private readonly logger = new Logger(RiskProfileController.name);

  constructor(
    private readonly riskAssessmentService: RiskAssessmentService,
    private readonly mlRiskScoringService: MLRiskScoringService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new risk profile' })
  @ApiResponse({
    status: 201,
    description: 'Risk profile created successfully',
    type: RiskProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createRiskProfile(
    @Body() createRiskProfileDto: CreateRiskProfileDto,
  ): Promise<RiskProfileResponseDto> {
    try {
      this.logger.log(`Creating risk profile for entity: ${createRiskProfileDto.entityId}`);

      const riskProfile = await this.riskAssessmentService.createRiskProfile(
        createRiskProfileDto,
      );

      // Perform initial ML risk scoring
      const mlScoring = await this.mlRiskScoringService.calculateRiskScore({
        entityId: riskProfile.entity_id,
        entityType: riskProfile.entity_type,
        riskFactors: riskProfile.risk_factors,
        transactionBehavior: riskProfile.transaction_behavior,
      });

      // Update risk profile with ML scoring
      await this.riskAssessmentService.updateMlScoring(riskProfile.id, mlScoring);

      this.logger.log(`Risk profile created with ID: ${riskProfile.id}`);
      return this.mapToResponseDto(riskProfile);
    } catch (error) {
      this.logger.error(`Failed to create risk profile: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create risk profile');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all risk profiles with filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of risk profiles',
    type: [RiskProfileResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'riskLevel', required: false, description: 'Filter by risk level' })
  @ApiQuery({ name: 'entityType', required: false, description: 'Filter by entity type' })
  @ApiQuery({ name: 'customerType', required: false, description: 'Filter by customer type' })
  @ApiQuery({ name: 'monitoringEnabled', required: false, description: 'Filter by monitoring status' })
  async getRiskProfiles(
    @Query() query: RiskProfileQueryDto,
  ): Promise<{ data: RiskProfileResponseDto[]; total: number; page: number; limit: number }> {
    try {
      this.logger.log('Retrieving risk profiles with filters', query);

      const result = await this.riskAssessmentService.getRiskProfiles(query);

      return {
        data: result.data.map(profile => this.mapToResponseDto(profile)),
        total: result.total,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve risk profiles: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve risk profiles');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get risk profile by ID' })
  @ApiParam({ name: 'id', description: 'Risk profile ID' })
  @ApiResponse({
    status: 200,
    description: 'Risk profile details',
    type: RiskProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Risk profile not found' })
  async getRiskProfile(@Param('id') id: string): Promise<RiskProfileResponseDto> {
    try {
      this.logger.log(`Retrieving risk profile: ${id}`);

      const riskProfile = await this.riskAssessmentService.getRiskProfileById(id);
      if (!riskProfile) {
        throw new NotFoundException(`Risk profile with ID ${id} not found`);
      }

      return this.mapToResponseDto(riskProfile);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve risk profile: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve risk profile');
    }
  }

  @Get('entity/:entityId')
  @ApiOperation({ summary: 'Get risk profile by entity ID' })
  @ApiParam({ name: 'entityId', description: 'Entity ID (User or Business)' })
  @ApiResponse({
    status: 200,
    description: 'Risk profile details',
    type: RiskProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Risk profile not found' })
  async getRiskProfileByEntity(@Param('entityId') entityId: string): Promise<RiskProfileResponseDto> {
    try {
      this.logger.log(`Retrieving risk profile for entity: ${entityId}`);

      const riskProfile = await this.riskAssessmentService.getRiskProfileByEntityId(entityId);
      if (!riskProfile) {
        throw new NotFoundException(`Risk profile for entity ${entityId} not found`);
      }

      return this.mapToResponseDto(riskProfile);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve risk profile for entity: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve risk profile');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update risk profile' })
  @ApiParam({ name: 'id', description: 'Risk profile ID' })
  @ApiResponse({
    status: 200,
    description: 'Risk profile updated successfully',
    type: RiskProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Risk profile not found' })
  async updateRiskProfile(
    @Param('id') id: string,
    @Body() updateRiskProfileDto: UpdateRiskProfileDto,
  ): Promise<RiskProfileResponseDto> {
    try {
      this.logger.log(`Updating risk profile: ${id}`);

      const updatedProfile = await this.riskAssessmentService.updateRiskProfile(
        id,
        updateRiskProfileDto,
      );

      this.logger.log(`Risk profile updated: ${id}`);
      return this.mapToResponseDto(updatedProfile);
    } catch (error) {
      this.logger.error(`Failed to update risk profile: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Risk profile with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update risk profile');
    }
  }

  @Post(':id/reassess')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reassess risk profile using latest data and ML models' })
  @ApiParam({ name: 'id', description: 'Risk profile ID' })
  @ApiResponse({
    status: 200,
    description: 'Risk reassessment completed',
    type: RiskAssessmentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Risk profile not found' })
  async reassessRiskProfile(
    @Param('id') id: string,
    @Body() reassessmentRequest?: RiskAssessmentRequestDto,
  ): Promise<RiskAssessmentResponseDto> {
    try {
      this.logger.log(`Reassessing risk profile: ${id}`);

      const result = await this.riskAssessmentService.reassessRiskProfile(
        id,
        reassessmentRequest,
      );

      this.logger.log(`Risk reassessment completed for profile: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to reassess risk profile: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Risk profile with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to reassess risk profile');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete risk profile' })
  @ApiParam({ name: 'id', description: 'Risk profile ID' })
  @ApiResponse({ status: 204, description: 'Risk profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Risk profile not found' })
  async deleteRiskProfile(@Param('id') id: string): Promise<void> {
    try {
      this.logger.log(`Deleting risk profile: ${id}`);

      await this.riskAssessmentService.deleteRiskProfile(id);

      this.logger.log(`Risk profile deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete risk profile: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Risk profile with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to delete risk profile');
    }
  }

  @Get(':id/assessment-history')
  @ApiOperation({ summary: 'Get risk assessment history' })
  @ApiParam({ name: 'id', description: 'Risk profile ID' })
  @ApiResponse({
    status: 200,
    description: 'Risk assessment history',
    type: [RiskAssessmentResponseDto],
  })
  async getAssessmentHistory(
    @Param('id') id: string,
    @Query('limit') limit: number = 10,
  ): Promise<RiskAssessmentResponseDto[]> {
    try {
      this.logger.log(`Retrieving assessment history for risk profile: ${id}`);

      const history = await this.riskAssessmentService.getAssessmentHistory(id, limit);

      return history;
    } catch (error) {
      this.logger.error(`Failed to retrieve assessment history: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve assessment history');
    }
  }

  @Get('due-for-review')
  @ApiOperation({ summary: 'Get risk profiles due for review' })
  @ApiResponse({
    status: 200,
    description: 'Risk profiles due for review',
    type: [RiskProfileResponseDto],
  })
  async getProfilesDueForReview(): Promise<RiskProfileResponseDto[]> {
    try {
      this.logger.log('Retrieving risk profiles due for review');

      const profiles = await this.riskAssessmentService.getProfilesDueForReview();

      return profiles.map(profile => this.mapToResponseDto(profile));
    } catch (error) {
      this.logger.error(`Failed to retrieve profiles due for review: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve profiles due for review');
    }
  }

  private mapToResponseDto(profile: any): RiskProfileResponseDto {
    return {
      id: profile.id,
      entityId: profile.entity_id,
      entityType: profile.entity_type,
      riskLevel: profile.risk_level,
      overallRiskScore: profile.overall_risk_score,
      customerType: profile.customer_type,
      customerSegment: profile.customer_segment,
      geographicRisk: profile.geographic_risk,
      productRisk: profile.product_risk,
      channelRisk: profile.channel_risk,
      occupationRisk: profile.occupation_risk,
      industryRisk: profile.industry_risk,
      pepStatus: profile.pep_status,
      sanctionsHit: profile.sanctions_hit,
      adverseMedia: profile.adverse_media,
      riskFactors: profile.risk_factors,
      transactionBehavior: profile.transaction_behavior,
      mlRiskScoring: profile.ml_risk_scoring,
      countryOfResidence: profile.country_of_residence,
      countriesOfOperation: profile.countries_of_operation,
      regulatoryStatus: profile.regulatory_status,
      dueDiligenceLevel: profile.due_diligence_level,
      lastAssessmentDate: profile.last_assessment_date,
      nextAssessmentDate: profile.next_assessment_date,
      assessmentFrequency: profile.assessment_frequency,
      riskAppetiteThreshold: profile.risk_appetite_threshold,
      monitoringEnabled: profile.monitoring_enabled,
      alertThreshold: profile.alert_threshold,
      notes: profile.notes,
      assessedBy: profile.assessed_by,
      approvedBy: profile.approved_by,
      approvedAt: profile.approved_at,
      metadata: profile.metadata,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  }
}