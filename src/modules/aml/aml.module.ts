import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';

// Controllers
// import { RiskprofileController } from './application/controllers/risk-profile.controller';
// import { TransactionController } from './application/controllers/transaction.controller';
// import { AlertController } from './application/controllers/alert.controller';
// import { MLController } from './application/controllers/ml.controller';
// import { ReportsController } from './application/controllers/reports.controller';
// import { InvestigationController } from './application/controllers/investigation.controller';
import { ComplianceScreeningController } from './application/controllers/compliance-screening.controller';

// Services (commented out deleted ones)
// import { RiskAssessmentService } from './application/domain/services/risk-assessment.service';
// import { MLRiskScoringService } from './application/domain/services/ml-risk-scoring.service';
// import { AlertManagementService } from './application/domain/services/alert-management.service';
import { SARCTRReportingService } from './application/services/sar-ctr-reporting.service';
import { ExternalIntegrationsService } from './application/services/external-integrations.service';

// Event Handlers
import { EventHandlers } from './domain/handlers';

// ORM Entities - commented out due to cleanup
// import {
//   RiskProfileOrmEntity,
//   AmlAlertOrmEntity,
//   TransactionMonitoringRuleOrmEntity,
//   MlModelOrmEntity,
// } from './infrastructure/orm-entities';

@Module({
  imports: [
    // TypeOrmModule.forFeature([
    //   RiskProfileOrmEntity,
    //   AmlAlertOrmEntity,
    //   TransactionMonitoringRuleOrmEntity,
    //   MlModelOrmEntity,
    // ]),
    CqrsModule,
    HttpModule,
  ],
  controllers: [
    // RiskprofileController,
    // TransactionController,
    // AlertController,
    // MLController,
    // ReportsController,
    // InvestigationController,
    ComplianceScreeningController,
  ],
  providers: [
    // RiskAssessmentService,
    // MLRiskScoringService,
    // AlertManagementService,
    SARCTRReportingService,
    ExternalIntegrationsService,
    ...EventHandlers,
  ],
  exports: [
    // RiskAssessmentService,
    // MLRiskScoringService,
    // AlertManagementService,
    SARCTRReportingService,
    ExternalIntegrationsService,
  ],
})
export class AMLModule {}