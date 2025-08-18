import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface SARReportRequest {
  reportingInstitution: {
    name: string;
    ein: string; // Employer Identification Number
    address: string;
    contactPerson: string;
    phoneNumber: string;
    emailAddress: string;
  };
  suspiciousActivity: {
    activityType: 'structuring' | 'money_laundering' | 'terrorist_financing' | 'other';
    description: string;
    amountInvolved: number;
    currency: string;
    dateOfActivity: Date;
    dateFirstDetected: Date;
    ongoingActivity: boolean;
  };
  subjectInformation: {
    type: 'individual' | 'business';
    name: string;
    address?: string;
    dateOfBirth?: Date;
    ssn?: string;
    ein?: string;
    accountNumbers: string[];
    relationshipToInstitution: string;
  };
  transactionDetails: Array<{
    transactionId: string;
    date: Date;
    amount: number;
    currency: string;
    type: string;
    description: string;
    involvedParties: string[];
  }>;
  supportingDocumentation: {
    investigationSummary: string;
    attachments: string[];
    evidenceDescription: string;
  };
  filingInformation: {
    preparedBy: string;
    preparedDate: Date;
    supervisorReview: boolean;
    supervisorName?: string;
    bsaContactOffice: string;
  };
}

export interface CTRReportRequest {
  reportingInstitution: {
    name: string;
    ein: string;
    address: string;
    contactPerson: string;
    phoneNumber: string;
  };
  transactionDetails: {
    transactionId: string;
    date: Date;
    totalAmount: number;
    currency: string;
    transactionType: 'cash_in' | 'cash_out' | 'aggregated_transactions';
    conductedBy: {
      type: 'individual' | 'business';
      name: string;
      address: string;
      dateOfBirth?: Date;
      ssn?: string;
      ein?: string;
      idType: string;
      idNumber: string;
    };
    onBehalfOf?: {
      type: 'individual' | 'business';
      name: string;
      address: string;
      relationship: string;
    };
  };
  accountInformation: {
    accountNumber: string;
    accountType: string;
    accountTitle: string;
    openDate: Date;
  };
  filingInformation: {
    preparedBy: string;
    preparedDate: Date;
    bsaContactOffice: string;
  };
}

export interface RegulatoryReport {
  id: string;
  type: 'SAR' | 'CTR';
  status: 'draft' | 'pending_review' | 'submitted' | 'acknowledged' | 'rejected';
  reportData: SARReportRequest | CTRReportRequest;
  submissionDetails?: {
    submittedAt: Date;
    submittedBy: string;
    submissionId: string;
    acknowledgmentNumber?: string;
  };
  reviewHistory: Array<{
    reviewedBy: string;
    reviewedAt: Date;
    action: 'approved' | 'rejected' | 'requested_changes';
    comments: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SARCTRReportingService {
  private readonly logger = new Logger(SARCTRReportingService.name);
  private readonly reports: Map<string, RegulatoryReport> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createSARReport(request: SARReportRequest, createdBy: string): Promise<string> {
    try {
      this.logger.log('Creating SAR (Suspicious Activity Report)');

      const reportId = `SAR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const report: RegulatoryReport = {
        id: reportId,
        type: 'SAR',
        status: 'draft',
        reportData: request,
        reviewHistory: [{
          reviewedBy: createdBy,
          reviewedAt: new Date(),
          action: 'approved',
          comments: 'Report created',
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.reports.set(reportId, report);

      this.logger.log(`SAR report created: ${reportId}`);

      // Emit event for compliance tracking
      this.eventEmitter.emit('sar.created', {
        reportId,
        activityType: request.suspiciousActivity.activityType,
        amountInvolved: request.suspiciousActivity.amountInvolved,
        subjectName: request.subjectInformation.name,
        createdBy,
      });

      return reportId;
    } catch (error) {
      this.logger.error('Failed to create SAR report:', error);
      throw error;
    }
  }

  async createCTRReport(request: CTRReportRequest, createdBy: string): Promise<string> {
    try {
      this.logger.log('Creating CTR (Currency Transaction Report)');

      const reportId = `CTR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const report: RegulatoryReport = {
        id: reportId,
        type: 'CTR',
        status: 'draft',
        reportData: request,
        reviewHistory: [{
          reviewedBy: createdBy,
          reviewedAt: new Date(),
          action: 'approved',
          comments: 'Report created',
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.reports.set(reportId, report);

      this.logger.log(`CTR report created: ${reportId}`);

      // Emit event for compliance tracking
      this.eventEmitter.emit('ctr.created', {
        reportId,
        transactionAmount: request.transactionDetails.totalAmount,
        conductedBy: request.transactionDetails.conductedBy.name,
        createdBy,
      });

      return reportId;
    } catch (error) {
      this.logger.error('Failed to create CTR report:', error);
      throw error;
    }
  }

  async getReport(reportId: string): Promise<RegulatoryReport | null> {
    return this.reports.get(reportId) || null;
  }

  async updateReportStatus(
    reportId: string,
    status: RegulatoryReport['status'],
    reviewedBy: string,
    comments?: string,
  ): Promise<RegulatoryReport> {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

    const previousStatus = report.status;
    report.status = status;
    report.updatedAt = new Date();

    report.reviewHistory.push({
      reviewedBy,
      reviewedAt: new Date(),
      action: status === 'submitted' ? 'approved' : status === 'rejected' ? 'rejected' : 'approved',
      comments: comments || `Status changed from ${previousStatus} to ${status}`,
    });

    this.reports.set(reportId, report);

    this.logger.log(`Report ${reportId} status updated: ${previousStatus} -> ${status}`);

    // Emit status change event
    this.eventEmitter.emit('regulatory_report.status_changed', {
      reportId,
      reportType: report.type,
      previousStatus,
      newStatus: status,
      reviewedBy,
    });

    return report;
  }

  async submitReport(reportId: string, submittedBy: string): Promise<{ submissionId: string; acknowledgmentNumber?: string }> {
    try {
      const report = this.reports.get(reportId);
      if (!report) {
        throw new Error(`Report not found: ${reportId}`);
      }

      if (report.status !== 'pending_review') {
        throw new Error(`Report must be in 'pending_review' status to submit. Current status: ${report.status}`);
      }

      // Validate report data
      this.validateReport(report);

      // Generate submission details
      const submissionId = `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const acknowledgmentNumber = `ACK_${reportId.slice(-8)}_${Date.now()}`;

      report.submissionDetails = {
        submittedAt: new Date(),
        submittedBy,
        submissionId,
        acknowledgmentNumber,
      };

      // In real implementation, this would submit to FinCEN BSA E-Filing System
      await this.submitToRegulatory(report);

      report.status = 'submitted';
      report.updatedAt = new Date();

      report.reviewHistory.push({
        reviewedBy: submittedBy,
        reviewedAt: new Date(),
        action: 'approved',
        comments: `Report submitted with submission ID: ${submissionId}`,
      });

      this.reports.set(reportId, report);

      this.logger.log(`Report ${reportId} submitted successfully. Submission ID: ${submissionId}`);

      // Emit submission event
      this.eventEmitter.emit('regulatory_report.submitted', {
        reportId,
        reportType: report.type,
        submissionId,
        acknowledgmentNumber,
        submittedBy,
      });

      return { submissionId, acknowledgmentNumber };
    } catch (error) {
      this.logger.error(`Failed to submit report ${reportId}:`, error);
      throw error;
    }
  }

  async searchReports(criteria: {
    type?: 'SAR' | 'CTR';
    status?: RegulatoryReport['status'];
    createdFrom?: Date;
    createdTo?: Date;
    submittedBy?: string;
    subjectName?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ reports: RegulatoryReport[]; total: number }> {
    let reports = Array.from(this.reports.values());

    // Apply filters
    if (criteria.type) {
      reports = reports.filter(report => report.type === criteria.type);
    }

    if (criteria.status) {
      reports = reports.filter(report => report.status === criteria.status);
    }

    if (criteria.createdFrom) {
      reports = reports.filter(report => report.createdAt >= criteria.createdFrom!);
    }

    if (criteria.createdTo) {
      reports = reports.filter(report => report.createdAt <= criteria.createdTo!);
    }

    if (criteria.subjectName) {
      reports = reports.filter(report => {
        if (report.type === 'SAR') {
          const sarData = report.reportData as SARReportRequest;
          return sarData.subjectInformation.name.toLowerCase().includes(criteria.subjectName!.toLowerCase());
        } else {
          const ctrData = report.reportData as CTRReportRequest;
          return ctrData.transactionDetails.conductedBy.name.toLowerCase().includes(criteria.subjectName!.toLowerCase());
        }
      });
    }

    // Sort by creation date (newest first)
    reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = reports.length;

    // Apply pagination
    if (criteria.offset) {
      reports = reports.slice(criteria.offset);
    }

    if (criteria.limit) {
      reports = reports.slice(0, criteria.limit);
    }

    return { reports, total };
  }

  async getReportingStatistics(dateFrom?: Date, dateTo?: Date): Promise<{
    totalReports: number;
    sarReports: number;
    ctrReports: number;
    byStatus: Record<string, number>;
    submissionRate: number;
    averageProcessingTime: number;
    complianceScore: number;
  }> {
    let reports = Array.from(this.reports.values());

    if (dateFrom) {
      reports = reports.filter(report => report.createdAt >= dateFrom);
    }

    if (dateTo) {
      reports = reports.filter(report => report.createdAt <= dateTo);
    }

    const byStatus: Record<string, number> = {};
    const statuses = ['draft', 'pending_review', 'submitted', 'acknowledged', 'rejected'];
    statuses.forEach(status => byStatus[status] = 0);

    let totalProcessingTime = 0;
    let processedReports = 0;

    reports.forEach(report => {
      byStatus[report.status]++;

      if (report.submissionDetails) {
        processedReports++;
        totalProcessingTime += report.submissionDetails.submittedAt.getTime() - report.createdAt.getTime();
      }
    });

    const submittedReports = byStatus.submitted + byStatus.acknowledged;
    const submissionRate = reports.length > 0 ? submittedReports / reports.length : 0;
    const averageProcessingTime = processedReports > 0 ? totalProcessingTime / processedReports : 0;

    // Simple compliance score based on submission rate and rejection rate
    const rejectionRate = reports.length > 0 ? byStatus.rejected / reports.length : 0;
    const complianceScore = Math.max(0, (submissionRate * 0.7) + ((1 - rejectionRate) * 0.3));

    return {
      totalReports: reports.length,
      sarReports: reports.filter(r => r.type === 'SAR').length,
      ctrReports: reports.filter(r => r.type === 'CTR').length,
      byStatus,
      submissionRate,
      averageProcessingTime: Math.round(averageProcessingTime / (1000 * 60 * 60)), // Hours
      complianceScore: Math.round(complianceScore * 100) / 100,
    };
  }

  async generateComplianceReport(dateFrom: Date, dateTo: Date): Promise<{
    reportingPeriod: { from: Date; to: Date };
    summary: any;
    detailedReports: RegulatoryReport[];
    complianceMetrics: {
      timeliness: number;
      accuracy: number;
      completeness: number;
      overallScore: number;
    };
    recommendations: string[];
  }> {
    const statistics = await this.getReportingStatistics(dateFrom, dateTo);
    const { reports } = await this.searchReports({ createdFrom: dateFrom, createdTo: dateTo });

    // Calculate compliance metrics
    const timeliness = this.calculateTimelinessScore(reports);
    const accuracy = this.calculateAccuracyScore(reports);
    const completeness = this.calculateCompletenessScore(reports);
    const overallScore = (timeliness + accuracy + completeness) / 3;

    // Generate recommendations
    const recommendations = this.generateComplianceRecommendations(statistics, {
      timeliness,
      accuracy,
      completeness,
      overallScore,
    });

    return {
      reportingPeriod: { from: dateFrom, to: dateTo },
      summary: statistics,
      detailedReports: reports,
      complianceMetrics: {
        timeliness,
        accuracy,
        completeness,
        overallScore,
      },
      recommendations,
    };
  }

  private validateReport(report: RegulatoryReport): void {
    if (report.type === 'SAR') {
      this.validateSARReport(report.reportData as SARReportRequest);
    } else {
      this.validateCTRReport(report.reportData as CTRReportRequest);
    }
  }

  private validateSARReport(sar: SARReportRequest): void {
    if (!sar.reportingInstitution.name || !sar.reportingInstitution.ein) {
      throw new Error('Reporting institution information is incomplete');
    }

    if (!sar.suspiciousActivity.description || sar.suspiciousActivity.amountInvolved <= 0) {
      throw new Error('Suspicious activity information is incomplete');
    }

    if (!sar.subjectInformation.name) {
      throw new Error('Subject information is incomplete');
    }

    if (!sar.supportingDocumentation.investigationSummary) {
      throw new Error('Investigation summary is required');
    }
  }

  private validateCTRReport(ctr: CTRReportRequest): void {
    if (!ctr.reportingInstitution.name || !ctr.reportingInstitution.ein) {
      throw new Error('Reporting institution information is incomplete');
    }

    if (ctr.transactionDetails.totalAmount < 10000) {
      throw new Error('CTR is only required for transactions over $10,000');
    }

    if (!ctr.transactionDetails.conductedBy.name) {
      throw new Error('Transaction conductor information is incomplete');
    }

    if (!ctr.accountInformation.accountNumber) {
      throw new Error('Account information is required');
    }
  }

  private async submitToRegulatory(report: RegulatoryReport): Promise<void> {
    // In real implementation, this would integrate with FinCEN BSA E-Filing System
    // For now, simulate the submission process
    
    this.logger.log(`Simulating submission to FinCEN for report: ${report.id}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random acknowledgment (95% success rate)
    if (Math.random() < 0.95) {
      this.logger.log(`Report ${report.id} acknowledged by FinCEN`);
    } else {
      throw new Error('FinCEN system temporarily unavailable');
    }
  }

  private calculateTimelinessScore(reports: RegulatoryReport[]): number {
    // Score based on how quickly reports are submitted after creation
    const submittedReports = reports.filter(r => r.submissionDetails);
    if (submittedReports.length === 0) return 0;

    const averageSubmissionTime = submittedReports.reduce((sum, report) => {
      const timeDiff = report.submissionDetails!.submittedAt.getTime() - report.createdAt.getTime();
      return sum + timeDiff;
    }, 0) / submittedReports.length;

    // Convert to hours and score (24 hours = 100%, 72 hours = 50%, >168 hours = 0%)
    const hoursToSubmit = averageSubmissionTime / (1000 * 60 * 60);
    return Math.max(0, Math.min(1, (168 - hoursToSubmit) / 168));
  }

  private calculateAccuracyScore(reports: RegulatoryReport[]): number {
    // Score based on rejection rate (inversely proportional)
    const totalReports = reports.length;
    if (totalReports === 0) return 1;

    const rejectedReports = reports.filter(r => r.status === 'rejected').length;
    return Math.max(0, 1 - (rejectedReports / totalReports));
  }

  private calculateCompletenessScore(reports: RegulatoryReport[]): number {
    // Score based on how complete the report data is
    if (reports.length === 0) return 1;

    const completeReports = reports.filter(report => {
      try {
        this.validateReport(report);
        return true;
      } catch {
        return false;
      }
    }).length;

    return completeReports / reports.length;
  }

  private generateComplianceRecommendations(
    statistics: any,
    metrics: { timeliness: number; accuracy: number; completeness: number; overallScore: number },
  ): string[] {
    const recommendations: string[] = [];

    if (metrics.timeliness < 0.8) {
      recommendations.push('Improve report submission timeliness - consider automated workflows');
    }

    if (metrics.accuracy < 0.9) {
      recommendations.push('Enhance report review process to reduce rejections');
    }

    if (metrics.completeness < 0.95) {
      recommendations.push('Implement additional data validation checks before submission');
    }

    if (statistics.submissionRate < 0.9) {
      recommendations.push('Review draft reports and ensure timely completion');
    }

    if (statistics.averageProcessingTime > 48) {
      recommendations.push('Streamline internal review process to reduce processing time');
    }

    if (recommendations.length === 0) {
      recommendations.push('Compliance reporting is performing well - maintain current standards');
    }

    return recommendations;
  }
}