import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { Repositories } from "@modules/risk-profile/infrastructure/repositories";
import { Queries } from "@modules/risk-profile/application/queries";
import { Mappers } from "@modules/risk-profile/infrastructure/mappers";
import { UseCases } from "@modules/risk-profile/application/domain/usecases";
import { Controllers } from "@modules/risk-profile/application/controllers";
import { CommandHandlers } from "@modules/risk-profile/application/commands";
import { OrmEntities } from "@modules/risk-profile/infrastructure/orm-entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Services } from "@modules/risk-profile/application/domain/services";

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
export class RiskProfileModule {}