import { IEvent } from '@nestjs/cqrs';

export class RiskAssessmentUpdatedEvent implements IEvent {
  constructor(
    public readonly entityId: string,
    public readonly previousRiskLevel: string,
    public readonly newRiskLevel: string,
    public readonly riskScore: number,
    public readonly factors: string[],
    public readonly updatedAt: Date = new Date(),
  ) {}
}