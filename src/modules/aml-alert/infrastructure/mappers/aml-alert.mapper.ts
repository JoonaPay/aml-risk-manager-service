import { BaseMapper } from "@core/infrastructure/base-mapper";
import { AmlAlertOrmEntity } from "@modules/aml-alert/infrastructure/orm-entities/aml-alert.orm-entity";
import { AmlAlertEntity } from "@modules/aml-alert/application/domain/entities/aml-alert.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AmlAlertMapper extends BaseMapper<
  AmlAlertEntity,
  AmlAlertOrmEntity
> {
  toOrm(domainEntity: AmlAlertEntity): AmlAlertOrmEntity {
    const ormEntity = new AmlAlertOrmEntity();
    ormEntity.id = domainEntity.id;
    // Map your properties from camelCase to snake_case
    // Example: ormEntity.property_name = domainEntity.propertyName;
    
    return ormEntity;
  }

  toDomain(ormEntity: AmlAlertOrmEntity): AmlAlertEntity {
    // TODO: Implement proper mapping from ORM to domain entity
    throw new Error('Not implemented');
  }
}