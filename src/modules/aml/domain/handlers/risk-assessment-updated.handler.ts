import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { RiskAssessmentUpdatedEvent } from '../events/risk-assessment-updated.event';

@EventsHandler(RiskAssessmentUpdatedEvent)
export class RiskAssessmentUpdatedHandler implements IEventHandler<RiskAssessmentUpdatedEvent> {
  private readonly logger = new Logger(RiskAssessmentUpdatedHandler.name);

  async handle(event: RiskAssessmentUpdatedEvent) {
    this.logger.log(`Risk assessment updated for entity ${event.entityId}`);
    this.logger.log(`Risk level changed from ${event.previousRiskLevel} to ${event.newRiskLevel}`);
    
    // Handle risk level changes:
    if (this.isRiskIncreased(event.previousRiskLevel, event.newRiskLevel)) {
      this.logger.warn(`Risk level increased for entity ${event.entityId}`);
      
      // - Notify risk management team
      // - Trigger enhanced monitoring
      // - Review transaction limits
      // - Generate alert if needed
      
    } else if (this.isRiskDecreased(event.previousRiskLevel, event.newRiskLevel)) {
      this.logger.log(`Risk level decreased for entity ${event.entityId}`);
      
      // - Update monitoring frequency
      // - Review transaction limits for increase
    }
    
    this.logger.debug(`Risk factors: ${event.factors.join(', ')}`);
  }

  private isRiskIncreased(previous: string, current: string): boolean {
    const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return levels.indexOf(current) > levels.indexOf(previous);
  }

  private isRiskDecreased(previous: string, current: string): boolean {
    const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return levels.indexOf(current) < levels.indexOf(previous);
  }
}