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
  Response,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { AlertManagementService } from '../domain/services/alert-management.service';
import { 
  CreateSarReportDto,
  UpdateSarReportDto,
  SarReportResponseDto,
  SarReportQueryDto,
  ComplianceReportRequestDto,
  ComplianceReportResponseDto,
  MetricsReportDto,
  RegulatoryFilingDto,
} from '../dto/requests/reports.dto';

@ApiTags('Regulatory Reports')
@ApiBearerAuth()
@Controller('api/v1/reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  constructor(
    private readonly alertManagementService: AlertManagementService,
  ) {}

  @Post('sar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Suspicious Activity Report (SAR)' })
  @ApiResponse({
    status: 201,
    description: 'SAR created successfully',
    type: SarReportResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid SAR data' })
  async createSarReport(@Body() createSarDto: CreateSarReportDto): Promise<SarReportResponseDto> {
    try {
      this.logger.log(`Creating SAR for alert: ${createSarDto.alertId}`);

      const sarReport = await this.alertManagementService.createSarReport(createSarDto);

      this.logger.log(`SAR created with ID: ${sarReport.id}`);
      return this.mapToSarResponseDto(sarReport);
    } catch (error) {
      this.logger.error(`Failed to create SAR: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create SAR report');
    }
  }

  @Get('sar')
  @ApiOperation({ summary: 'Get all SAR reports with filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of SAR reports',
    type: [SarReportResponseDto],
  })
  async getSarReports(
    @Query() query: SarReportQueryDto,
  ): Promise<{ data: SarReportResponseDto[]; total: number; page: number; limit: number }> {
    try {
      this.logger.log('Retrieving SAR reports with filters', query);

      const result = await this.alertManagementService.getSarReports(query);

      return {
        data: result.data.map(sar => this.mapToSarResponseDto(sar)),
        total: result.total,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve SAR reports: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve SAR reports');
    }
  }

  @Get('sar/:id')
  @ApiOperation({ summary: 'Get SAR report by ID' })
  @ApiParam({ name: 'id', description: 'SAR report ID' })
  @ApiResponse({
    status: 200,
    description: 'SAR report details',
    type: SarReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'SAR report not found' })
  async getSarReport(@Param('id') id: string): Promise<SarReportResponseDto> {
    try {
      this.logger.log(`Retrieving SAR report: ${id}`);

      const sarReport = await this.alertManagementService.getSarReportById(id);
      if (!sarReport) {
        throw new NotFoundException(`SAR report with ID ${id} not found`);
      }

      return this.mapToSarResponseDto(sarReport);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve SAR report: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve SAR report');
    }
  }

  @Put('sar/:id')
  @ApiOperation({ summary: 'Update SAR report' })
  @ApiParam({ name: 'id', description: 'SAR report ID' })
  @ApiResponse({
    status: 200,
    description: 'SAR report updated successfully',
    type: SarReportResponseDto,
  })
  async updateSarReport(
    @Param('id') id: string,
    @Body() updateSarDto: UpdateSarReportDto,
  ): Promise<SarReportResponseDto> {
    try {
      this.logger.log(`Updating SAR report: ${id}`);

      const updatedSar = await this.alertManagementService.updateSarReport(id, updateSarDto);

      this.logger.log(`SAR report updated: ${id}`);
      return this.mapToSarResponseDto(updatedSar);
    } catch (error) {
      this.logger.error(`Failed to update SAR report: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`SAR report with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to update SAR report');
    }
  }

  @Post('sar/:id/file')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'File SAR report with regulatory authorities' })
  @ApiParam({ name: 'id', description: 'SAR report ID' })
  @ApiResponse({
    status: 200,
    description: 'SAR filed successfully',
    type: RegulatoryFilingDto,
  })
  async fileSarReport(
    @Param('id') id: string,
    @Body() filingData?: { filingMethod?: string; urgentFiling?: boolean },
  ): Promise<RegulatoryFilingDto> {
    try {
      this.logger.log(`Filing SAR report: ${id}`);

      const filing = await this.alertManagementService.fileSarReport(id, filingData);

      this.logger.log(`SAR filed successfully: ${id}`);
      return filing;
    } catch (error) {
      this.logger.error(`Failed to file SAR report: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`SAR report with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to file SAR report');
    }
  }

  @Get('sar/:id/export')
  @ApiOperation({ summary: 'Export SAR report in regulatory format' })
  @ApiParam({ name: 'id', description: 'SAR report ID' })
  @ApiQuery({ name: 'format', required: false, description: 'Export format (pdf, xml, json)' })
  @ApiResponse({ status: 200, description: 'SAR export file' })
  async exportSarReport(
    @Param('id') id: string,
    @Query('format') format: string = 'pdf',
    @Response() res: ExpressResponse,
  ): Promise<void> {
    try {
      this.logger.log(`Exporting SAR report: ${id} in format: ${format}`);

      const exportData = await this.alertManagementService.exportSarReport(id, format);

      res.setHeader('Content-Type', this.getContentType(format));
      res.setHeader('Content-Disposition', `attachment; filename="SAR_${id}.${format}"`);
      res.send(exportData);

      this.logger.log(`SAR report exported: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to export SAR report: ${error.message}`, error.stack);
      if (error.message.includes('not found')) {
        throw new NotFoundException(`SAR report with ID ${id} not found`);
      }
      throw new BadRequestException('Failed to export SAR report');
    }
  }

  @Post('compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate compliance report' })
  @ApiResponse({
    status: 200,
    description: 'Compliance report generated',
    type: ComplianceReportResponseDto,
  })
  async generateComplianceReport(
    @Body() reportRequest: ComplianceReportRequestDto,
  ): Promise<ComplianceReportResponseDto> {
    try {
      this.logger.log('Generating compliance report', reportRequest);

      const report = await this.alertManagementService.generateComplianceReport(reportRequest);

      this.logger.log('Compliance report generated successfully');
      return report;
    } catch (error) {
      this.logger.error(`Failed to generate compliance report: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to generate compliance report');
    }
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Get historical compliance reports' })
  @ApiQuery({ name: 'period', required: false, description: 'Report period (monthly, quarterly, annually)' })
  @ApiQuery({ name: 'year', required: false, description: 'Report year' })
  @ApiResponse({
    status: 200,
    description: 'Historical compliance reports',
    type: [ComplianceReportResponseDto],
  })
  async getComplianceReports(
    @Query('period') period: string = 'quarterly',
    @Query('year') year?: number,
  ): Promise<ComplianceReportResponseDto[]> {
    try {
      this.logger.log(`Retrieving compliance reports for period: ${period}, year: ${year}`);

      const reports = await this.alertManagementService.getComplianceReports(period, year);

      return reports;
    } catch (error) {
      this.logger.error(`Failed to retrieve compliance reports: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve compliance reports');
    }
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get AML metrics and KPIs' })
  @ApiQuery({ name: 'period', required: false, description: 'Metrics period (7d, 30d, 90d, 1y)' })
  @ApiResponse({
    status: 200,
    description: 'AML metrics and KPIs',
    type: MetricsReportDto,
  })
  async getMetrics(@Query('period') period: string = '30d'): Promise<MetricsReportDto> {
    try {
      this.logger.log(`Retrieving AML metrics for period: ${period}`);

      const metrics = await this.alertManagementService.getAmlMetrics(period);

      return metrics;
    } catch (error) {
      this.logger.error(`Failed to retrieve AML metrics: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve AML metrics');
    }
  }

  @Get('metrics/dashboard')
  @ApiOperation({ summary: 'Get real-time metrics dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Real-time metrics dashboard',
    type: 'object',
  })
  async getMetricsDashboard(): Promise<any> {
    try {
      this.logger.log('Retrieving real-time metrics dashboard');

      const dashboard = await this.alertManagementService.getMetricsDashboard();

      return dashboard;
    } catch (error) {
      this.logger.error(`Failed to retrieve metrics dashboard: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve metrics dashboard');
    }
  }

  @Get('audit-trail/:entityId')
  @ApiOperation({ summary: 'Get audit trail for an entity' })
  @ApiParam({ name: 'entityId', description: 'Entity ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  @ApiResponse({
    status: 200,
    description: 'Entity audit trail',
    type: 'object',
  })
  async getAuditTrail(
    @Param('entityId') entityId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    try {
      this.logger.log(`Retrieving audit trail for entity: ${entityId}`);

      const auditTrail = await this.alertManagementService.getAuditTrail(
        entityId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
      );

      return auditTrail;
    } catch (error) {
      this.logger.error(`Failed to retrieve audit trail: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve audit trail');
    }
  }

  @Get('regulatory-filing-status')
  @ApiOperation({ summary: 'Get regulatory filing status summary' })
  @ApiResponse({
    status: 200,
    description: 'Regulatory filing status',
    type: 'object',
  })
  async getRegulatoryFilingStatus(): Promise<any> {
    try {
      this.logger.log('Retrieving regulatory filing status');

      const status = await this.alertManagementService.getRegulatoryFilingStatus();

      return status;
    } catch (error) {
      this.logger.error(`Failed to retrieve filing status: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve regulatory filing status');
    }
  }

  @Post('bulk-export')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk export reports for regulatory submission' })
  @ApiResponse({ status: 200, description: 'Bulk export initiated' })
  async bulkExportReports(
    @Body() exportRequest: {
      reportTypes: string[];
      dateRange: { startDate: Date; endDate: Date };
      format: string;
      includeAttachments: boolean;
    },
  ): Promise<{ exportId: string; status: string }> {
    try {
      this.logger.log('Initiating bulk export of reports');

      const exportJob = await this.alertManagementService.initiateBulkExport(exportRequest);

      return exportJob;
    } catch (error) {
      this.logger.error(`Failed to initiate bulk export: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to initiate bulk export');
    }
  }

  @Get('export-status/:exportId')
  @ApiOperation({ summary: 'Get bulk export status' })
  @ApiParam({ name: 'exportId', description: 'Export job ID' })
  @ApiResponse({ status: 200, description: 'Export status' })
  async getExportStatus(@Param('exportId') exportId: string): Promise<any> {
    try {
      this.logger.log(`Checking export status: ${exportId}`);

      const status = await this.alertManagementService.getExportStatus(exportId);

      return status;
    } catch (error) {
      this.logger.error(`Failed to get export status: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to get export status');
    }
  }

  @Get('quality-assurance')
  @ApiOperation({ summary: 'Get quality assurance metrics' })
  @ApiQuery({ name: 'period', required: false, description: 'QA period (30d, 90d, 1y)' })
  @ApiResponse({
    status: 200,
    description: 'Quality assurance metrics',
    type: 'object',
  })
  async getQualityAssuranceMetrics(@Query('period') period: string = '90d'): Promise<any> {
    try {
      this.logger.log(`Retrieving QA metrics for period: ${period}`);

      const qaMetrics = await this.alertManagementService.getQualityAssuranceMetrics(period);

      return qaMetrics;
    } catch (error) {
      this.logger.error(`Failed to retrieve QA metrics: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve QA metrics');
    }
  }

  private mapToSarResponseDto(sar: any): SarReportResponseDto {
    return {
      id: sar.id,
      sarReference: sar.sar_reference,
      alertId: sar.alert_id,
      entityId: sar.entity_id,
      entityType: sar.entity_type,
      reportType: sar.report_type,
      filingReason: sar.filing_reason,
      priority: sar.priority,
      status: sar.status,
      subjectInformation: sar.subject_information,
      suspiciousActivityDetails: sar.suspicious_activity_details,
      transactionDetails: sar.transaction_details,
      financialInstitutionInfo: sar.financial_institution_info,
      lawEnforcementInfo: sar.law_enforcement_info,
      suspiciousActivityPeriod: sar.suspicious_activity_period,
      totalAmountInvolved: sar.total_amount_involved,
      currency: sar.currency,
      narrativeDescription: sar.narrative_description,
      lawEnforcementNotified: sar.law_enforcement_notified,
      lawEnforcementAgency: sar.law_enforcement_agency,
      regulatoryAgency: sar.regulatory_agency,
      filingMethod: sar.filing_method,
      formType: sar.form_type,
      bsaId: sar.bsa_id,
      acknowledgmentNumber: sar.acknowledgment_number,
      filingDate: sar.filing_date,
      filingDeadline: sar.filing_deadline,
      lateFiling: sar.late_filing,
      lateFilingReason: sar.late_filing_reason,
      amendmentToSar: sar.amendment_to_sar,
      amendmentReason: sar.amendment_reason,
      correctedSar: sar.corrected_sar,
      confidentialityClaim: sar.confidentiality_claim,
      supportingDocumentation: sar.supporting_documentation,
      internalCaseNumber: sar.internal_case_number,
      riskAssessment: sar.risk_assessment,
      investigationSummary: sar.investigation_summary,
      followUpActions: sar.follow_up_actions,
      qualityAssuranceReview: sar.quality_assurance_review,
      complianceOfficerReview: sar.compliance_officer_review,
      legalReview: sar.legal_review,
      autoGenerated: sar.auto_generated,
      aiAssisted: sar.ai_assisted,
      tags: sar.tags,
      createdBy: sar.created_by,
      createdAt: sar.created_at,
      updatedAt: sar.updated_at,
    };
  }

  private getContentType(format: string): string {
    switch (format.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'xml':
        return 'application/xml';
      case 'json':
        return 'application/json';
      case 'csv':
        return 'text/csv';
      default:
        return 'application/octet-stream';
    }
  }
}