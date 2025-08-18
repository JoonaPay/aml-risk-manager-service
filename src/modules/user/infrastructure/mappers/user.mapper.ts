import { BaseMapper } from "@core/infrastructure/base-mapper";
import { UserOrmEntity } from "@modules/user/infrastructure/orm-entities/user.orm-entity";
import { UserEntity } from "@modules/user/application/domain/entities/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserMapper extends BaseMapper<
  UserEntity,
  UserOrmEntity
> {
  toOrm(domainEntity: UserEntity): UserOrmEntity {
    const ormEntity = new UserOrmEntity();
    ormEntity.id = domainEntity.id;
    // Map your properties from camelCase to snake_case
    // Example: ormEntity.property_name = domainEntity.propertyName;
    
    return ormEntity;
  }

  toDomain(ormEntity: UserOrmEntity): UserEntity {
    const entity = new UserEntity({
      id: ormEntity.id,
      // Map your properties from snake_case to camelCase
      // Example: propertyName: ormEntity.property_name,
    });
    
    return entity;
  }
}