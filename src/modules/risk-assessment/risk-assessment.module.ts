import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { Repositories } from "@modules/risk-assessment/infrastructure/repositories";
import { Queries } from "@modules/risk-assessment/application/queries";
import { Mappers } from "@modules/risk-assessment/infrastructure/mappers";
import { UseCases } from "@modules/risk-assessment/application/domain/usecases";
import { Controllers } from "@modules/risk-assessment/application/controllers";
import { CommandHandlers } from "@modules/risk-assessment/application/commands";
import { OrmEntities } from "@modules/risk-assessment/infrastructure/orm-entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Services } from "@modules/risk-assessment/application/domain/services";

@Module({
  imports: [TypeOrmModule.forFeature([...OrmEntities]), CqrsModule],
  providers: [
    ...CommandHandlers,
    ...Queries,
    ...Repositories,
    ...Mappers,
    ...UseCases,
    ...Services,
  ],
  controllers: [...Controllers],
})
export class RiskAssessmentModule {}