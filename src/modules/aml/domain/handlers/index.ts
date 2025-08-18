import { SanctionsScreenRequestedHandler } from './sanctions-screen-requested.handler';
import { SanctionsScreenCompletedHandler } from './sanctions-screen-completed.handler';
import { RiskAssessmentUpdatedHandler } from './risk-assessment-updated.handler';

export const EventHandlers = [
  SanctionsScreenRequestedHandler,
  SanctionsScreenCompletedHandler,
  RiskAssessmentUpdatedHandler,
];

export * from './sanctions-screen-requested.handler';
export * from './sanctions-screen-completed.handler';
export * from './risk-assessment-updated.handler';