import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { Repositories } from "@modules/user/infrastructure/repositories";
import { Queries } from "@modules/user/application/queries";
import { Mappers } from "@modules/user/infrastructure/mappers";
import { UseCases } from "@modules/user/application/domain/usecases";
import { Controllers } from "@modules/user/application/controllers";
import { CommandHandlers } from "@modules/user/application/commands";
import { OrmEntities } from "@modules/user/infrastructure/orm-entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Services } from "@modules/user/application/domain/services";

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
export class UserModule {}