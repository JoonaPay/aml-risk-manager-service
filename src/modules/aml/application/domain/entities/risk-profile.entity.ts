export enum RiskLevel {
  VERY_LOW = 'very_low',
  LOW = 'low', 
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress', 
  RESOLVED = 'resolved',
  FALSE_POSITIVE = 'false_positive',
  ESCALATED = 'escalated',
  CLOSED = 'closed',
}

export enum AlertType {
  UNUSUAL_TRANSACTION_PATTERN = 'unusual_transaction_pattern',
  HIGH_VELOCITY_TRANSACTIONS = 'high_velocity_transactions',
  STRUCTURING_SUSPICION = 'structuring_suspicion',
  GEOGRAPHIC_ANOMALY = 'geographic_anomaly',
  SANCTIONS_MATCH = 'sanctions_match',
  PEP_MATCH = 'pep_match',
  ADVERSE_MEDIA = 'adverse_media',
  ROUND_AMOUNT_PATTERN = 'round_amount_pattern',
  CROSS_BORDER_RISK = 'cross_border_risk',
  DORMANT_ACCOUNT_ACTIVITY = 'dormant_account_activity',
  CASH_INTENSIVE_BUSINESS = 'cash_intensive_business',
  HIGH_RISK_JURISDICTION = 'high_risk_jurisdiction',
}

export interface RiskFactors {
  geographicRisk: number;
  transactionPatternRisk: number;
  velocityRisk: number;
  sanctionsRisk: number;
  pepRisk: number;
  adverseMediaRisk: number;
  industryRisk: number;
  channelRisk: number;
  behavioralRisk: number;
}

export interface TransactionBehavior {
  averageTransactionAmount: number;
  transactionFrequency: number;
  preferredTimeOfDay: string[];
  preferredDaysOfWeek: string[];
  geographicPatterns: string[];
  counterpartyPatterns: string[];
  seasonalPatterns?: Record<string, number>;
}

export interface MLRiskScoring {
  modelVersion: string;
  features: Record<string, number>;
  prediction: number;
  confidence: number;
  explainability: {
    topFeatures: Array<{
      feature: string;
      importance: number;
      value: number;
    }>;
  };
  lastUpdated: Date;
}

export class RiskProfile {
  constructor(
    public readonly id: string,
    public readonly entityId: string,
    public readonly entityType: 'individual' | 'business',
    public riskLevel: RiskLevel,
    public overallRiskScore: number,
    public riskFactors: RiskFactors,
    public transactionBehavior: TransactionBehavior,
    public mlRiskScoring?: MLRiskScoring,
    public lastAssessment?: Date,
    public nextReviewDate?: Date,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  updateRiskScore(newScore: number, factors: RiskFactors): void {
    this.overallRiskScore = newScore;
    this.riskFactors = factors;
    this.riskLevel = this.calculateRiskLevel(newScore);
    this.lastAssessment = new Date();
    this.nextReviewDate = this.calculateNextReviewDate();
    this.updatedAt = new Date();
  }

  updateTransactionBehavior(behavior: TransactionBehavior): void {
    this.transactionBehavior = behavior;
    this.updatedAt = new Date();
  }

  updateMLScoring(mlScoring: MLRiskScoring): void {
    this.mlRiskScoring = mlScoring;
    this.updatedAt = new Date();
  }

  isHighRisk(): boolean {
    return this.riskLevel === RiskLevel.HIGH || 
           this.riskLevel === RiskLevel.VERY_HIGH || 
           this.riskLevel === RiskLevel.CRITICAL;
  }

  requiresEnhancedDueDiligence(): boolean {
    return this.overallRiskScore >= 0.7;
  }

  isDueForReview(): boolean {
    return this.nextReviewDate ? new Date() >= this.nextReviewDate : true;
  }

  private calculateRiskLevel(score: number): RiskLevel {
    if (score >= 0.9) return RiskLevel.CRITICAL;
    if (score >= 0.75) return RiskLevel.VERY_HIGH;
    if (score >= 0.6) return RiskLevel.HIGH;
    if (score >= 0.4) return RiskLevel.MEDIUM;
    if (score >= 0.2) return RiskLevel.LOW;
    return RiskLevel.VERY_LOW;
  }

  private calculateNextReviewDate(): Date {
    const today = new Date();
    const daysToAdd = this.isHighRisk() ? 30 : 90; // High risk: monthly, others: quarterly
    return new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
  }
}

export class RiskAlert {
  constructor(
    public readonly id: string,
    public readonly entityId: string,
    public readonly entityType: 'individual' | 'business',
    public readonly alertType: AlertType,
    public status: AlertStatus,
    public readonly severity: RiskLevel,
    public readonly description: string,
    public readonly details: Record<string, any>,
    public readonly triggeredBy: {
      ruleId?: string;
      ruleName?: string;
      threshold?: number;
      actualValue?: number;
      mlModel?: string;
    },
    public assignedTo?: string,
    public investigationNotes?: string[],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public resolvedAt?: Date,
  ) {}

  assignTo(investigatorId: string): void {
    this.assignedTo = investigatorId;
    this.status = AlertStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  addInvestigationNote(note: string, investigator: string): void {
    this.investigationNotes = this.investigationNotes || [];
    this.investigationNotes.push(`${new Date().toISOString()} - ${investigator}: ${note}`);
    this.updatedAt = new Date();
  }

  resolve(resolution: 'false_positive' | 'resolved' | 'escalated', notes?: string): void {
    this.status = resolution === 'false_positive' ? AlertStatus.FALSE_POSITIVE :
                  resolution === 'escalated' ? AlertStatus.ESCALATED : AlertStatus.RESOLVED;
    
    if (notes) {
      this.addInvestigationNote(`Resolution: ${resolution}. ${notes}`, 'system');
    }
    
    this.resolvedAt = new Date();
    this.updatedAt = new Date();
  }

  escalate(reason: string): void {
    this.status = AlertStatus.ESCALATED;
    this.addInvestigationNote(`Escalated: ${reason}`, 'system');
    this.updatedAt = new Date();
  }

  isOpen(): boolean {
    return this.status === AlertStatus.OPEN || this.status === AlertStatus.IN_PROGRESS;
  }

  getResolutionTime(): number | null {
    if (!this.resolvedAt) return null;
    return this.resolvedAt.getTime() - this.createdAt.getTime();
  }
}