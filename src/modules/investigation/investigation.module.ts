import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { Repositories } from "@modules/investigation/infrastructure/repositories";
import { Queries } from "@modules/investigation/application/queries";
import { Mappers } from "@modules/investigation/infrastructure/mappers";
import { UseCases } from "@modules/investigation/application/domain/usecases";
import { Controllers } from "@modules/investigation/application/controllers";
import { CommandHandlers } from "@modules/investigation/application/commands";
import { OrmEntities } from "@modules/investigation/infrastructure/orm-entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Services } from "@modules/investigation/application/domain/services";

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
export class InvestigationModule {}