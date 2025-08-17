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
import { AlertManagementService } from '../domain/services/alert-management.service';
import { 
  CreateAlertDto,
  UpdateAlertDto,
  AlertQueryDto,
  AlertResponseDto,
  AlertInvestigationDto,
  AlertResolutionDto,
  AlertEscalationDto,
  AlertDashboardDto,
  AlertAssignmentDto,
} from '../dto/requests/alert.dto';

@ApiTags('Alert Management')
@ApiBearerAuth()
@Controller('api/v1/alerts')
export class AlertController {
  private readonly logger = new Logger(AlertController.name);

  constructor(
    private readonly alertManagementService: AlertManagementService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new AML alert' })
  @ApiResponse({
    status: 201,
    description: 'Alert created successfully',
    type: AlertResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid alert data' })
  async createAlert(@Body() createAlertDto: CreateAlertDto): Promise<AlertResponseDto> {
    try {
      this.logger.log(`Creating alert for entity: ${createAlertDto.entityId}`);

      const alert = await this.alertManagementService.createAlert(createAlertDto);

      this.logger.log(`Alert created with ID: ${alert.id}`);
      return this.mapToResponseDto(alert);
    } catch (error) {
      this.logger.error(`Failed to create alert: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create alert');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all alerts with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of alerts',
    type: [AlertResponseDto],
  })
  async getAlerts(
    @Query() query: AlertQueryDto,
  ): Promise<{ data: AlertResponseDto[]; total: number; page: number; limit: number }> {
    try {
      this.logger.log('Retrieving alerts with filters', query);

      const result = await this.alertManagementService.getAlerts(query);

      return {
        data: result.data.map(alert => this.mapToResponseDto(alert)),
        total: result.total,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve alerts: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve alerts');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alert by ID' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: 200,
    description: 'Alert details',
    type: AlertResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async getAlert(@Param('id') id: string): Promise<AlertResponseDto> {
    try {
      this.logger.log(`Retrieving alert: ${id}`);

      const alert = await this.alertManagementService.getAlertById(id);
      if (!alert) {
        throw new NotFoundException(`Alert with ID ${id} not found`);
      }

      return this.mapToResponseDto(alert);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve alert: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve alert');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: 200,
    description: 'Alert updated successfully',
    type: AlertResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async updateAlert(
    @Param('id') id: string,
    @Body() updateAlertDto: UpdateAlertDto,
  ): Promise<AlertResponseDto> {
    try {
      this.logger.log(`Updating alert: ${id}`);

      const updatedAlert = await this.alertManagementService.updateAlert(id, updateAlertDto);

      this.logger.log(`Alert updated: ${id}`);
      return this.mapToResponseDto(updatedAlert);
    } catch (error) {
      this.logger.error(`Failed to update alert: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Alert with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update alert');
    }
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign alert to investigator' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: 200,
    description: 'Alert assigned successfully',
    type: AlertResponseDto,
  })
  async assignAlert(
    @Param('id') id: string,
    @Body() assignmentDto: AlertAssignmentDto,
  ): Promise<AlertResponseDto> {
    try {
      this.logger.log(`Assigning alert ${id} to ${assignmentDto.assignedTo}`);

      const alert = await this.alertManagementService.assignAlert(
        id,
        assignmentDto.assignedTo,
        assignmentDto.assignedBy,
        assignmentDto.notes,
      );

      this.logger.log(`Alert assigned: ${id}`);
      return this.mapToResponseDto(alert);
    } catch (error) {
      this.logger.error(`Failed to assign alert: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Alert with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to assign alert');
    }
  }

  @Put(':id/investigate')
  @ApiOperation({ summary: 'Add investigation details to alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: 200,
    description: 'Investigation details added',
    type: AlertResponseDto,
  })
  async investigateAlert(
    @Param('id') id: string,
    @Body() investigationDto: AlertInvestigationDto,
  ): Promise<AlertResponseDto> {
    try {
      this.logger.log(`Adding investigation to alert: ${id}`);

      const alert = await this.alertManagementService.addInvestigation(id, investigationDto);

      this.logger.log(`Investigation added to alert: ${id}`);
      return this.mapToResponseDto(alert);
    } catch (error) {
      this.logger.error(`Failed to add investigation: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Alert with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to add investigation');
    }
  }

  @Post(':id/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: 200,
    description: 'Alert resolved successfully',
    type: AlertResponseDto,
  })
  async resolveAlert(
    @Param('id') id: string,
    @Body() resolutionDto: AlertResolutionDto,
  ): Promise<AlertResponseDto> {
    try {
      this.logger.log(`Resolving alert: ${id}`);

      const alert = await this.alertManagementService.resolveAlert(id, resolutionDto);

      this.logger.log(`Alert resolved: ${id}`);
      return this.mapToResponseDto(alert);
    } catch (error) {
      this.logger.error(`Failed to resolve alert: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Alert with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to resolve alert');
    }
  }

  @Post(':id/escalate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Escalate alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({
    status: 200,
    description: 'Alert escalated successfully',
    type: AlertResponseDto,
  })
  async escalateAlert(
    @Param('id') id: string,
    @Body() escalationDto: AlertEscalationDto,
  ): Promise<AlertResponseDto> {
    try {
      this.logger.log(`Escalating alert: ${id}`);

      const alert = await this.alertManagementService.escalateAlert(id, escalationDto);

      this.logger.log(`Alert escalated: ${id}`);
      return this.mapToResponseDto(alert);
    } catch (error) {
      this.logger.error(`Failed to escalate alert: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`Alert with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to escalate alert');
    }
  }

  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Get alert dashboard summary' })
  @ApiResponse({
    status: 200,
    description: 'Alert dashboard data',
    type: AlertDashboardDto,
  })
  async getAlertDashboard(): Promise<AlertDashboardDto> {
    try {
      this.logger.log('Retrieving alert dashboard data');

      const dashboard = await this.alertManagementService.getAlertDashboard();

      return dashboard;
    } catch (error) {
      this.logger.error(`Failed to retrieve alert dashboard: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve alert dashboard');
    }
  }

  @Get('sla/breached')
  @ApiOperation({ summary: 'Get alerts with breached SLA' })
  @ApiResponse({
    status: 200,
    description: 'Alerts with breached SLA',
    type: [AlertResponseDto],
  })
  async getBreachedSlaAlerts(): Promise<AlertResponseDto[]> {
    try {
      this.logger.log('Retrieving alerts with breached SLA');

      const alerts = await this.alertManagementService.getBreachedSlaAlerts();

      return alerts.map(alert => this.mapToResponseDto(alert));
    } catch (error) {
      this.logger.error(`Failed to retrieve breached SLA alerts: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve breached SLA alerts');
    }
  }

  @Get('assigned/:userId')
  @ApiOperation({ summary: 'Get alerts assigned to a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Alerts assigned to user',
    type: [AlertResponseDto],
  })
  async getAssignedAlerts(@Param('userId') userId: string): Promise<AlertResponseDto[]> {
    try {
      this.logger.log(`Retrieving alerts assigned to user: ${userId}`);

      const alerts = await this.alertManagementService.getAssignedAlerts(userId);

      return alerts.map(alert => this.mapToResponseDto(alert));
    } catch (error) {
      this.logger.error(`Failed to retrieve assigned alerts: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve assigned alerts');
    }
  }

  @Get('entity/:entityId')
  @ApiOperation({ summary: 'Get alerts for a specific entity' })
  @ApiParam({ name: 'entityId', description: 'Entity ID' })
  @ApiResponse({
    status: 200,
    description: 'Alerts for entity',
    type: [AlertResponseDto],
  })
  async getEntityAlerts(
    @Param('entityId') entityId: string,
    @Query('limit') limit: number = 10,
  ): Promise<AlertResponseDto[]> {
    try {
      this.logger.log(`Retrieving alerts for entity: ${entityId}`);

      const alerts = await this.alertManagementService.getEntityAlerts(entityId, limit);

      return alerts.map(alert => this.mapToResponseDto(alert));
    } catch (error) {
      this.logger.error(`Failed to retrieve entity alerts: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve entity alerts');
    }
  }

  @Get('analytics/trends')
  @ApiOperation({ summary: 'Get alert trend analytics' })
  @ApiQuery({ name: 'period', required: false, description: 'Analysis period (7d, 30d, 90d)' })
  @ApiResponse({
    status: 200,
    description: 'Alert trend analytics',
    type: 'object',
  })
  async getAlertTrends(@Query('period') period: string = '30d'): Promise<any> {
    try {
      this.logger.log(`Retrieving alert trends for period: ${period}`);

      const trends = await this.alertManagementService.getAlertTrends(period);

      return trends;
    } catch (error) {
      this.logger.error(`Failed to retrieve alert trends: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve alert trends');
    }
  }

  @Post('bulk/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk assign alerts' })
  @ApiResponse({ status: 200, description: 'Alerts assigned successfully' })
  async bulkAssignAlerts(
    @Body() bulkAssignment: { alertIds: string[]; assignedTo: string; assignedBy: string },
  ): Promise<{ success: number; failed: number }> {
    try {
      this.logger.log(`Bulk assigning ${bulkAssignment.alertIds.length} alerts`);

      const result = await this.alertManagementService.bulkAssignAlerts(
        bulkAssignment.alertIds,
        bulkAssignment.assignedTo,
        bulkAssignment.assignedBy,
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to bulk assign alerts: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to bulk assign alerts');
    }
  }

  private mapToResponseDto(alert: any): AlertResponseDto {
    return {
      id: alert.id,
      riskProfileId: alert.risk_profile_id,
      entityId: alert.entity_id,
      alertReference: alert.alert_reference,
      alertType: alert.alert_type,
      severity: alert.severity,
      priority: alert.priority,
      status: alert.status,
      riskScore: alert.risk_score,
      confidenceLevel: alert.confidence_level,
      transactionId: alert.transaction_id,
      transactionAmount: alert.transaction_amount,
      transactionCurrency: alert.transaction_currency,
      alertData: alert.alert_data,
      detectionRules: alert.detection_rules,
      mlFeatures: alert.ml_features,
      investigationNotes: alert.investigation_notes,
      resolutionNotes: alert.resolution_notes,
      falsePositiveReason: alert.false_positive_reason,
      assignedTo: alert.assigned_to,
      assignedAt: alert.assigned_at,
      investigatedBy: alert.investigated_by,
      investigatedAt: alert.investigated_at,
      resolvedBy: alert.resolved_by,
      resolvedAt: alert.resolved_at,
      escalatedTo: alert.escalated_to,
      escalatedAt: alert.escalated_at,
      sarFiled: alert.sar_filed,
      sarReference: alert.sar_reference,
      sarFiledAt: alert.sar_filed_at,
      autoGenerated: alert.auto_generated,
      slaDueDate: alert.sla_due_date,
      slaBreached: alert.sla_breached,
      tags: alert.tags,
      relatedAlerts: alert.related_alerts,
      externalReferences: alert.external_references,
      metadata: alert.metadata,
      createdAt: alert.created_at,
      updatedAt: alert.updated_at,
    };
  }
}