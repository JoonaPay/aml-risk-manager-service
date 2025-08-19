import { BaseDomainEntity } from "@core/domain/base-domain-entity";

export enum AlertType {
  TRANSACTION_MONITORING = 'TRANSACTION_MONITORING',
  SANCTIONS_SCREENING = 'SANCTIONS_SCREENING',
  PEP_SCREENING = 'PEP_SCREENING',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  THRESHOLD_BREACH = 'THRESHOLD_BREACH',
  PATTERN_DETECTION = 'PATTERN_DETECTION',
  MANUAL_REVIEW = 'MANUAL_REVIEW'
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AlertStatus {
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
  INVESTIGATED = 'INVESTIGATED',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED',
  FALSE_POSITIVE = 'FALSE_POSITIVE'
}

export enum AlertPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

export interface AlertMetadata {
  triggeredRules: string[];
  riskScore: number;
  confidence: number;
  matchedPatterns: string[];
  relatedAlerts: string[];
  automaticReview?: boolean;
  escalationReason?: string;
  escalatedFromStatus?: AlertStatus;
  resolutionNotes?: string;
  riskScoreUpdatedAt?: string;
}

export interface AlertContext {
  entityId: string;
  entityType: 'USER' | 'TRANSACTION' | 'ACCOUNT';
  transactionId?: string;
  accountId?: string;
  userId?: string;
  amount?: number;
  currency?: string;
  description?: string;
}

export interface BaseDomainEntityProps {
  id?: string;
}

export interface AmlAlertEntityProps extends BaseDomainEntityProps {
  alertReference: string;
  alertType: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  priority: AlertPriority;
  title: string;
  description: string;
  context: AlertContext;
  metadata: AlertMetadata;
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  escalatedAt?: Date;
  resolvedAt?: Date;
  dueDate?: Date;
  isActive?: boolean;
}

export class AmlAlertEntity extends BaseDomainEntity {
  private _alertReference: string;
  private _alertType: AlertType;
  private _severity: AlertSeverity;
  private _status: AlertStatus;
  private _priority: AlertPriority;
  private _title: string;
  private _description: string;
  private _context: AlertContext;
  private _metadata: AlertMetadata;
  private _assignedTo?: string;
  private _reviewedBy?: string;
  private _reviewedAt?: Date;
  private _escalatedAt?: Date;
  private _resolvedAt?: Date;
  private _dueDate?: Date;
  public readonly isActive: boolean;

  constructor(props: AmlAlertEntityProps) {
    super(props.id);
    this._alertReference = props.alertReference || this.generateAlertReference();
    this._alertType = props.alertType;
    this._severity = props.severity;
    this._status = props.status || AlertStatus.NEW;
    this._priority = props.priority || this.calculatePriority();
    this._title = props.title;
    this._description = props.description;
    this._context = props.context;
    this._metadata = props.metadata;
    this._assignedTo = props.assignedTo;
    this._reviewedBy = props.reviewedBy;
    this._reviewedAt = props.reviewedAt;
    this._escalatedAt = props.escalatedAt;
    this._resolvedAt = props.resolvedAt;
    this._dueDate = props.dueDate || this.calculateDueDate();
    this.isActive = props.isActive !== false;
  }

  // Business methods
  assign(userId: string): void {
    if (this._status === AlertStatus.CLOSED || this._status === AlertStatus.FALSE_POSITIVE) {
      throw new Error('Cannot assign closed or false positive alerts');
    }
    this._assignedTo = userId;
    if (this._status === AlertStatus.NEW) {
      this._status = AlertStatus.IN_REVIEW;
    }
  }

  startInvestigation(investigatorId: string): void {
    if (this._status !== AlertStatus.IN_REVIEW) {
      throw new Error('Can only start investigation on alerts in review');
    }
    this._status = AlertStatus.INVESTIGATED;
    this._assignedTo = investigatorId;
  }

  escalate(reason: string): void {
    if (this._status === AlertStatus.CLOSED || this._status === AlertStatus.FALSE_POSITIVE) {
      throw new Error('Cannot escalate closed or false positive alerts');
    }
    this._status = AlertStatus.ESCALATED;
    this._escalatedAt = new Date();
    this._priority = AlertPriority.URGENT;
    
    // Add escalation reason to metadata
    this._metadata = {
      ...this._metadata,
      escalationReason: reason,
      escalatedFromStatus: this._status
    };
  }

  resolve(reviewerId: string, resolution: 'CLOSED' | 'FALSE_POSITIVE', notes?: string): void {
    if (this._status === AlertStatus.NEW) {
      throw new Error('Cannot resolve alerts that have not been reviewed');
    }
    
    this._status = resolution === 'FALSE_POSITIVE' ? AlertStatus.FALSE_POSITIVE : AlertStatus.CLOSED;
    this._reviewedBy = reviewerId;
    this._reviewedAt = new Date();
    this._resolvedAt = new Date();
    
    if (notes) {
      this._metadata = {
        ...this._metadata,
        resolutionNotes: notes
      };
    }
  }

  updateRiskScore(newScore: number): void {
    if (newScore < 0 || newScore > 100) {
      throw new Error('Risk score must be between 0 and 100');
    }
    
    this._metadata = {
      ...this._metadata,
      riskScore: newScore,
      riskScoreUpdatedAt: new Date().toISOString()
    };

    // Auto-adjust severity based on risk score
    if (newScore >= 90) {
      this._severity = AlertSeverity.CRITICAL;
      this._priority = AlertPriority.URGENT;
    } else if (newScore >= 70) {
      this._severity = AlertSeverity.HIGH;
      this._priority = AlertPriority.HIGH;
    } else if (newScore >= 40) {
      this._severity = AlertSeverity.MEDIUM;
    } else {
      this._severity = AlertSeverity.LOW;
    }
  }

  isOverdue(): boolean {
    return this._dueDate ? new Date() > this._dueDate : false;
  }

  isDueSoon(hoursThreshold: number = 24): boolean {
    if (!this._dueDate) return false;
    const hoursUntilDue = (this._dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    return hoursUntilDue <= hoursThreshold && hoursUntilDue > 0;
  }

  private generateAlertReference(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `AML${date}${random}`;
  }

  private calculatePriority(): AlertPriority {
    switch (this._severity) {
      case AlertSeverity.CRITICAL:
        return AlertPriority.URGENT;
      case AlertSeverity.HIGH:
        return AlertPriority.HIGH;
      case AlertSeverity.MEDIUM:
        return AlertPriority.MEDIUM;
      default:
        return AlertPriority.LOW;
    }
  }

  private calculateDueDate(): Date {
    const now = new Date();
    const hoursToAdd = this._priority === AlertPriority.URGENT ? 4 :
                      this._priority === AlertPriority.HIGH ? 24 :
                      this._priority === AlertPriority.MEDIUM ? 72 : 168; // 1 week for low
    
    return new Date(now.getTime() + (hoursToAdd * 60 * 60 * 1000));
  }

  // Getters
  get alertReference(): string { return this._alertReference; }
  get alertType(): AlertType { return this._alertType; }
  get severity(): AlertSeverity { return this._severity; }
  get status(): AlertStatus { return this._status; }
  get priority(): AlertPriority { return this._priority; }
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get context(): AlertContext { return this._context; }
  get metadata(): AlertMetadata { return this._metadata; }
  get assignedTo(): string | undefined { return this._assignedTo; }
  get reviewedBy(): string | undefined { return this._reviewedBy; }
  get reviewedAt(): Date | undefined { return this._reviewedAt; }
  get escalatedAt(): Date | undefined { return this._escalatedAt; }
  get resolvedAt(): Date | undefined { return this._resolvedAt; }
  get dueDate(): Date | undefined { return this._dueDate; }
}