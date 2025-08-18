import { IEvent } from '@nestjs/cqrs';

export class SanctionsScreenRequestedEvent implements IEvent {
  constructor(
    public readonly entityId: string,
    public readonly entityType: 'person' | 'company',
    public readonly screeningData: {
      name: string;
      birthDate?: string;
      country?: string;
    },
    public readonly requestedAt: Date = new Date(),
  ) {}
}