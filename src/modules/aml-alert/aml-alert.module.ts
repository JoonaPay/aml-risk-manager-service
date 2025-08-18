import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { Repositories } from "@modules/aml-alert/infrastructure/repositories";
import { Queries } from "@modules/aml-alert/application/queries";
import { Mappers } from "@modules/aml-alert/infrastructure/mappers";
import { UseCases } from "@modules/aml-alert/application/domain/usecases";
import { Controllers } from "@modules/aml-alert/application/controllers";
import { CommandHandlers } from "@modules/aml-alert/application/commands";
import { OrmEntities } from "@modules/aml-alert/infrastructure/orm-entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Services } from "@modules/aml-alert/application/domain/services";

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
export class AmlAlertModule {}