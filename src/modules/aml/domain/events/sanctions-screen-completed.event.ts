import { IEvent } from '@nestjs/cqrs';

export class SanctionsScreenCompletedEvent implements IEvent {
  constructor(
    public readonly entityId: string,
    public readonly screeningId: string,
    public readonly hasMatches: boolean,
    public readonly matches: Array<{
      name: string;
      listName: string;
      matchScore: number;
      reason: string;
    }>,
    public readonly completedAt: Date = new Date(),
  ) {}
}