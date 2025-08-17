import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RiskAlert, AlertStatus, AlertType, RiskLevel } from '../entities/risk-profile.entity';

export interface CreateAlertRequest {
  entityId: string;
  entityType: 'individual' | 'business';
  alertType: AlertType;
  severity: RiskLevel;
  description: string;
  details: Record<string, any>;
  triggeredBy: {
    ruleId?: string;
    ruleName?: string;
    threshold?: number;
    actualValue?: number;
    mlModel?: string;
  };
}

export interface AlertInvestigationRequest {
  alertId: string;
  investigatorId: string;
  action: 'assign' | 'note' | 'resolve' | 'escalate';
  notes?: string;
  resolution?: 'false_positive' | 'resolved' | 'escalated';
}

export interface AlertQuery {
  entityId?: string;
  entityType?: 'individual' | 'business';
  alertType?: AlertType;
  status?: AlertStatus;
  severity?: RiskLevel;
  dateFrom?: Date;
  dateTo?: Date;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class AlertManagementService {
  private readonly logger = new Logger(AlertManagementService.name);
  private readonly alerts: Map<string, RiskAlert> = new Map();

  constructor(
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createAlert(request: CreateAlertRequest): Promise<RiskAlert> {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alert = new RiskAlert(
      alertId,
      request.entityId,
      request.entityType,
      request.alertType,
      AlertStatus.OPEN,
      request.severity,
      request.description,
      request.details,
      request.triggeredBy,
    );

    this.alerts.set(alertId, alert);
    
    this.logger.log(`🚨 Alert created: ${alertId} for entity: ${request.entityId} (${request.alertType})`);
    
    // Emit alert created event
    this.eventEmitter.emit('alert.created', {
      alertId,
      entityId: request.entityId,
      alertType: request.alertType,
      severity: request.severity,
    });

    // Auto-assign based on severity
    if (alert.severity === RiskLevel.CRITICAL || alert.severity === RiskLevel.VERY_HIGH) {
      this.eventEmitter.emit('alert.high_priority', {
        alertId,
        entityId: request.entityId,
        severity: request.severity,
      });
    }

    return alert;
  }

  async getAlert(alertId: string): Promise<RiskAlert | null> {
    return this.alerts.get(alertId) || null;
  }

  async getAlertsByEntity(entityId: string): Promise<RiskAlert[]> {
    return Array.from(this.alerts.values()).filter(alert => alert.entityId === entityId);
  }

  async queryAlerts(query: AlertQuery): Promise<{ alerts: RiskAlert[]; total: number }> {
    let results = Array.from(this.alerts.values());

    // Apply filters
    if (query.entityId) {
      results = results.filter(alert => alert.entityId === query.entityId);
    }

    if (query.entityType) {
      results = results.filter(alert => alert.entityType === query.entityType);
    }

    if (query.alertType) {
      results = results.filter(alert => alert.alertType === query.alertType);
    }

    if (query.status) {
      results = results.filter(alert => alert.status === query.status);
    }

    if (query.severity) {
      results = results.filter(alert => alert.severity === query.severity);
    }

    if (query.assignedTo) {
      results = results.filter(alert => alert.assignedTo === query.assignedTo);
    }

    if (query.dateFrom) {
      results = results.filter(alert => alert.createdAt >= query.dateFrom!);
    }

    if (query.dateTo) {
      results = results.filter(alert => alert.createdAt <= query.dateTo!);
    }

    // Sort by creation date (newest first)
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = results.length;

    // Apply pagination
    if (query.offset) {
      results = results.slice(query.offset);
    }

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return { alerts: results, total };
  }

  async investigateAlert(request: AlertInvestigationRequest): Promise<RiskAlert> {
    const alert = this.alerts.get(request.alertId);
    if (!alert) {
      throw new Error(`Alert not found: ${request.alertId}`);
    }

    switch (request.action) {
      case 'assign':
        alert.assignTo(request.investigatorId);
        this.logger.log(`Alert ${request.alertId} assigned to ${request.investigatorId}`);
        break;

      case 'note':
        if (request.notes) {
          alert.addInvestigationNote(request.notes, request.investigatorId);
          this.logger.log(`Investigation note added to alert ${request.alertId}`);
        }
        break;

      case 'resolve':
        if (request.resolution) {
          alert.resolve(request.resolution, request.notes);
          this.logger.log(`Alert ${request.alertId} resolved as ${request.resolution}`);
          
          this.eventEmitter.emit('alert.resolved', {
            alertId: request.alertId,
            resolution: request.resolution,
            investigatorId: request.investigatorId,
            resolutionTime: alert.getResolutionTime(),
          });
        }
        break;

      case 'escalate':
        alert.escalate(request.notes || 'Manual escalation');
        this.logger.log(`Alert ${request.alertId} escalated`);
        
        this.eventEmitter.emit('alert.escalated', {
          alertId: request.alertId,
          investigatorId: request.investigatorId,
          reason: request.notes,
        });
        break;
    }

    this.alerts.set(request.alertId, alert);
    return alert;
  }

  async getOpenAlerts(): Promise<RiskAlert[]> {
    return Array.from(this.alerts.values()).filter(alert => alert.isOpen());
  }

  async getHighPriorityAlerts(): Promise<RiskAlert[]> {
    return Array.from(this.alerts.values()).filter(alert => 
      alert.isOpen() && (
        alert.severity === RiskLevel.CRITICAL || 
        alert.severity === RiskLevel.VERY_HIGH ||
        alert.severity === RiskLevel.HIGH
      )
    );
  }

  async getAlertStatistics(dateFrom?: Date, dateTo?: Date): Promise<{
    total: number;
    byStatus: Record<AlertStatus, number>;
    bySeverity: Record<RiskLevel, number>;
    byType: Record<AlertType, number>;
    averageResolutionTime: number;
    falsePositiveRate: number;
  }> {
    let alerts = Array.from(this.alerts.values());

    if (dateFrom) {
      alerts = alerts.filter(alert => alert.createdAt >= dateFrom);
    }

    if (dateTo) {
      alerts = alerts.filter(alert => alert.createdAt <= dateTo);
    }

    const byStatus: Record<AlertStatus, number> = {} as any;
    const bySeverity: Record<RiskLevel, number> = {} as any;
    const byType: Record<AlertType, number> = {} as any;

    // Initialize counters
    Object.values(AlertStatus).forEach(status => byStatus[status] = 0);
    Object.values(RiskLevel).forEach(severity => bySeverity[severity] = 0);
    Object.values(AlertType).forEach(type => byType[type] = 0);

    let totalResolutionTime = 0;
    let resolvedCount = 0;
    let falsePositiveCount = 0;

    alerts.forEach(alert => {
      byStatus[alert.status]++;
      bySeverity[alert.severity]++;
      byType[alert.alertType]++;

      if (alert.resolvedAt) {
        resolvedCount++;
        totalResolutionTime += alert.getResolutionTime() || 0;

        if (alert.status === AlertStatus.FALSE_POSITIVE) {
          falsePositiveCount++;
        }
      }
    });

    return {
      total: alerts.length,
      byStatus,
      bySeverity,
      byType,
      averageResolutionTime: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0,
      falsePositiveRate: resolvedCount > 0 ? falsePositiveCount / resolvedCount : 0,
    };
  }

  async bulkAssignAlerts(alertIds: string[], investigatorId: string): Promise<number> {
    let assignedCount = 0;

    for (const alertId of alertIds) {
      try {
        await this.investigateAlert({
          alertId,
          investigatorId,
          action: 'assign',
        });
        assignedCount++;
      } catch (error) {
        this.logger.error(`Failed to assign alert ${alertId}:`, error);
      }
    }

    this.logger.log(`Bulk assigned ${assignedCount} alerts to ${investigatorId}`);
    return assignedCount;
  }

  async escalateStaleAlerts(maxAgeHours: number = 24): Promise<number> {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    const staleAlerts = Array.from(this.alerts.values()).filter(alert =>
      alert.isOpen() && 
      alert.createdAt < cutoffTime &&
      alert.status !== AlertStatus.ESCALATED
    );

    let escalatedCount = 0;

    for (const alert of staleAlerts) {
      try {
        await this.investigateAlert({
          alertId: alert.id,
          investigatorId: 'system',
          action: 'escalate',
          notes: `Auto-escalated after ${maxAgeHours} hours without resolution`,
        });
        escalatedCount++;
      } catch (error) {
        this.logger.error(`Failed to escalate stale alert ${alert.id}:`, error);
      }
    }

    if (escalatedCount > 0) {
      this.logger.log(`Auto-escalated ${escalatedCount} stale alerts`);
    }

    return escalatedCount;
  }

  async generateAlertReport(dateFrom: Date, dateTo: Date): Promise<{
    summary: any;
    details: RiskAlert[];
    recommendations: string[];
  }> {
    const statistics = await this.getAlertStatistics(dateFrom, dateTo);
    const alerts = Array.from(this.alerts.values()).filter(alert =>
      alert.createdAt >= dateFrom && alert.createdAt <= dateTo
    );

    const recommendations: string[] = [];

    // Generate recommendations based on statistics
    if (statistics.falsePositiveRate > 0.3) {
      recommendations.push('High false positive rate detected - consider tuning alert rules');
    }

    if (statistics.averageResolutionTime > 48 * 60 * 60 * 1000) { // 48 hours in ms
      recommendations.push('Average resolution time is high - consider increasing investigation capacity');
    }

    const openAlerts = statistics.byStatus[AlertStatus.OPEN] + statistics.byStatus[AlertStatus.IN_PROGRESS];
    if (openAlerts > statistics.total * 0.2) {
      recommendations.push('High number of open alerts - prioritize case resolution');
    }

    return {
      summary: statistics,
      details: alerts,
      recommendations,
    };
  }
}