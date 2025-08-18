import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SanctionsScreenRequestedEvent } from '../events/sanctions-screen-requested.event';

@EventsHandler(SanctionsScreenRequestedEvent)
export class SanctionsScreenRequestedHandler implements IEventHandler<SanctionsScreenRequestedEvent> {
  private readonly logger = new Logger(SanctionsScreenRequestedHandler.name);

  async handle(event: SanctionsScreenRequestedEvent) {
    this.logger.log(`Sanctions screening requested for entity ${event.entityId}`);
    
    // Here you could:
    // - Send notification to compliance team
    // - Log to audit trail
    // - Update monitoring dashboards
    // - Queue for batch processing
    
    this.logger.debug(`Screening requested for ${event.entityType}: ${event.screeningData.name}`);
  }
}