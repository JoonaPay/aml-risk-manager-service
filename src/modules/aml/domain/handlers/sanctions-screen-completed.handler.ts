import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SanctionsScreenCompletedEvent } from '../events/sanctions-screen-completed.event';

@EventsHandler(SanctionsScreenCompletedEvent)
export class SanctionsScreenCompletedHandler implements IEventHandler<SanctionsScreenCompletedEvent> {
  private readonly logger = new Logger(SanctionsScreenCompletedHandler.name);

  async handle(event: SanctionsScreenCompletedEvent) {
    this.logger.log(`Sanctions screening completed for entity ${event.entityId}`);
    
    if (event.hasMatches) {
      this.logger.warn(`Sanctions matches found for entity ${event.entityId}: ${event.matches.length} matches`);
      
      // Handle positive matches:
      // - Create alert/case
      // - Notify compliance team
      // - Block transactions if needed
      // - Update risk profile
      
      for (const match of event.matches) {
        this.logger.warn(`Match found: ${match.name} on ${match.listName} (score: ${match.matchScore})`);
      }
    } else {
      this.logger.log(`No sanctions matches found for entity ${event.entityId}`);
    }
  }
}