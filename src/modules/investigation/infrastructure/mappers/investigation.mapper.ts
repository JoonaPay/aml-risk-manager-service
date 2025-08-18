import { InvestigationOrmEntity } from "@modules/investigation/infrastructure/orm-entities/investigation.orm-entity";
import { InvestigationEntity } from "@modules/investigation/domain/entities/investigation.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InvestigationMapper {
  toOrmEntity(domainEntity: InvestigationEntity): InvestigationOrmEntity {
    if (!domainEntity) {
      throw new Error('Domain entity is required');
    }

    const ormEntity = new InvestigationOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.isActive = domainEntity.isActive;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    // Map your properties from camelCase to snake_case
    // Example: ormEntity.property_name = domainEntity.propertyName;
    
    return ormEntity;
  }

  toDomainEntity(ormEntity: InvestigationOrmEntity): InvestigationEntity {
    const entity = new InvestigationEntity({
      id: ormEntity.id,
      isActive: ormEntity.isActive,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
      // Map your properties from snake_case to camelCase
      // Example: propertyName: ormEntity.property_name,
    });
    
    return entity;
  }
}