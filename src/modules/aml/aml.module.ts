import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { RiskProfileController } from './application/controllers/risk-profile.controller';
import { TransactionController } from './application/controllers/transaction.controller';
import { AlertController } from './application/controllers/alert.controller';
import { MLController } from './application/controllers/ml.controller';
import { ReportsController } from './application/controllers/reports.controller';

// Services
import { RiskAssessmentService } from './application/domain/services/risk-assessment.service';
import { MLRiskScoringService } from './application/domain/services/ml-risk-scoring.service';
import { AlertManagementService } from './application/domain/services/alert-management.service';

// ORM Entities
import {
  RiskProfileOrmEntity,
  AmlAlertOrmEntity,
  TransactionMonitoringRuleOrmEntity,
  MlModelOrmEntity,
} from './infrastructure/orm-entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RiskProfileOrmEntity,
      AmlAlertOrmEntity,
      TransactionMonitoringRuleOrmEntity,
      MlModelOrmEntity,
    ]),
    CqrsModule,
  ],
  controllers: [
    RiskProfileController,
    TransactionController,
    AlertController,
    MLController,
    ReportsController,
  ],
  providers: [
    RiskAssessmentService,
    MLRiskScoringService,
    AlertManagementService,
  ],
  exports: [
    RiskAssessmentService,
    MLRiskScoringService,
    AlertManagementService,
  ],
})
export class AMLModule {}