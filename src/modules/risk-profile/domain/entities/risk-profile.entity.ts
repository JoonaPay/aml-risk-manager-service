import { BaseDomainEntity } from "@core/domain/base-domain-entity";

export enum RiskCategory {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export enum EntityType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  GOVERNMENT = 'GOVERNMENT',
  NON_PROFIT = 'NON_PROFIT'
}

export enum GeographicRisk {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM', 
  HIGH = 'HIGH',
  SANCTIONED = 'SANCTIONED'
}

export enum IndustryRisk {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
  PROHIBITED = 'PROHIBITED'
}

export interface RiskFactors {
  geographicRisk: GeographicRisk;
  industryRisk: IndustryRisk;
  productRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  channelRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  isPep: boolean;
  isSanctioned: boolean;
  hasAdverseMedia: boolean;
  transactionVolume: number;
  transactionFrequency: number;
  accountAge: number; // in months
  kycStatus: 'COMPLETE' | 'INCOMPLETE' | 'EXPIRED';
}

export interface RiskProfileEntityProps {
  id?: string;
  entityId: string;
  entityType: EntityType;
  overallRiskScore: number;
  riskCategory: RiskCategory;
  riskFactors: RiskFactors;
  lastAssessmentDate: Date;
  nextReviewDate: Date;
  assessedBy: string;
  reviewFrequency: number; // in months
  notes?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class RiskProfileEntity extends BaseDomainEntity {
  private _entityId: string;
  private _entityType: EntityType;
  private _overallRiskScore: number;
  private _riskCategory: RiskCategory;
  private _riskFactors: RiskFactors;
  private _lastAssessmentDate: Date;
  private _nextReviewDate: Date;
  private _assessedBy: string;
  private _reviewFrequency: number;
  private _notes?: string;
  private _metadata?: Record<string, any>;
  public readonly isActive: boolean;

  constructor(props: RiskProfileEntityProps) {
    super(props.id);
    this._entityId = props.entityId;
    this._entityType = props.entityType;
    this._overallRiskScore = props.overallRiskScore;
    this._riskCategory = props.riskCategory || this.calculateRiskCategory(props.overallRiskScore);
    this._riskFactors = props.riskFactors;
    this._lastAssessmentDate = props.lastAssessmentDate;
    this._nextReviewDate = props.nextReviewDate || this.calculateNextReviewDate();
    this._assessedBy = props.assessedBy;
    this._reviewFrequency = props.reviewFrequency || this.getDefaultReviewFrequency();
    this._notes = props.notes;
    this._metadata = props.metadata;
    this.isActive = props.isActive !== false;
  }

  // Business methods
  updateRiskScore(newScore: number, assessorId: string, reason?: string): void {
    if (newScore < 0 || newScore > 100) {
      throw new Error('Risk score must be between 0 and 100');
    }

    const previousScore = this._overallRiskScore;
    const previousCategory = this._riskCategory;

    this._overallRiskScore = newScore;
    this._riskCategory = this.calculateRiskCategory(newScore);
    this._lastAssessmentDate = new Date();
    this._assessedBy = assessorId;
    this._nextReviewDate = this.calculateNextReviewDate();

    // Log the change in metadata
    if (!this._metadata) this._metadata = {};
    if (!this._metadata.scoreHistory) this._metadata.scoreHistory = [];
    
    this._metadata.scoreHistory.push({
      previousScore,
      newScore,
      previousCategory,
      newCategory: this._riskCategory,
      assessorId,
      reason,
      timestamp: new Date().toISOString()
    });
  }

  updateRiskFactors(factors: Partial<RiskFactors>, assessorId: string): void {
    this._riskFactors = { ...this._riskFactors, ...factors };
    
    // Recalculate risk score based on new factors
    const newScore = this.calculateRiskScore();
    this.updateRiskScore(newScore, assessorId, 'Risk factors updated');
  }

  triggerReview(reason?: string): void {
    this._nextReviewDate = new Date(); // Immediate review
    
    if (!this._metadata) this._metadata = {};
    this._metadata.reviewTriggered = {
      reason: reason || 'Manual review triggered',
      triggeredAt: new Date().toISOString()
    };
  }

  isOverdue(): boolean {
    return new Date() > this._nextReviewDate;
  }

  isDueSoon(daysThreshold: number = 30): boolean {
    const daysUntilReview = (this._nextReviewDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilReview <= daysThreshold && daysUntilReview > 0;
  }

  requiresEnhancedDueDiligence(): boolean {
    return this._riskCategory === RiskCategory.HIGH || 
           this._riskCategory === RiskCategory.VERY_HIGH ||
           this._riskFactors.isPep ||
           this._riskFactors.isSanctioned ||
           this._riskFactors.hasAdverseMedia;
  }

  private calculateRiskScore(): number {
    let score = 0;

    // Geographic risk (0-25 points)
    switch (this._riskFactors.geographicRisk) {
      case GeographicRisk.SANCTIONED: score += 25; break;
      case GeographicRisk.HIGH: score += 20; break;
      case GeographicRisk.MEDIUM: score += 10; break;
      case GeographicRisk.LOW: score += 5; break;
    }

    // Industry risk (0-20 points)
    switch (this._riskFactors.industryRisk) {
      case IndustryRisk.PROHIBITED: score += 25; break; // Over 100 to flag
      case IndustryRisk.VERY_HIGH: score += 20; break;
      case IndustryRisk.HIGH: score += 15; break;
      case IndustryRisk.MEDIUM: score += 8; break;
      case IndustryRisk.LOW: score += 3; break;
    }

    // PEP status (0-15 points)
    if (this._riskFactors.isPep) score += 15;

    // Sanctions (0-25 points) 
    if (this._riskFactors.isSanctioned) score += 25;

    // Adverse media (0-10 points)
    if (this._riskFactors.hasAdverseMedia) score += 10;

    // Transaction patterns (0-15 points)
    const volumeScore = Math.min(this._riskFactors.transactionVolume / 1000000 * 5, 8); // $1M = 5 points
    const frequencyScore = Math.min(this._riskFactors.transactionFrequency / 100 * 4, 7); // 100 txns = 4 points
    score += volumeScore + frequencyScore;

    return Math.min(score, 100); // Cap at 100
  }

  private calculateRiskCategory(score: number): RiskCategory {
    if (score >= 80) return RiskCategory.VERY_HIGH;
    if (score >= 60) return RiskCategory.HIGH;
    if (score >= 30) return RiskCategory.MEDIUM;
    return RiskCategory.LOW;
  }

  private calculateNextReviewDate(): Date {
    const months = this._reviewFrequency;
    const nextReview = new Date();
    nextReview.setMonth(nextReview.getMonth() + months);
    return nextReview;
  }

  private getDefaultReviewFrequency(): number {
    switch (this._riskCategory) {
      case RiskCategory.VERY_HIGH: return 3; // 3 months
      case RiskCategory.HIGH: return 6; // 6 months
      case RiskCategory.MEDIUM: return 12; // 12 months
      default: return 24; // 24 months
    }
  }

  // Getters
  get entityId(): string { return this._entityId; }
  get entityType(): EntityType { return this._entityType; }
  get overallRiskScore(): number { return this._overallRiskScore; }
  get riskCategory(): RiskCategory { return this._riskCategory; }
  get riskFactors(): RiskFactors { return this._riskFactors; }
  get lastAssessmentDate(): Date { return this._lastAssessmentDate; }
  get nextReviewDate(): Date { return this._nextReviewDate; }
  get assessedBy(): string { return this._assessedBy; }
  get reviewFrequency(): number { return this._reviewFrequency; }
  get notes(): string | undefined { return this._notes; }
  get metadata(): Record<string, any> | undefined { return this._metadata; }
}