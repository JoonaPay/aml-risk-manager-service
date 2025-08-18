import { RiskprofileOrmEntity } from "@modules/risk-profile/infrastructure/orm-entities/risk-profile.orm-entity";
import { RiskprofileEntity } from "@modules/risk-profile/domain/entities/risk-profile.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RiskprofileMapper {
  toOrmEntity(domainEntity: RiskprofileEntity): RiskprofileOrmEntity {
    if (!domainEntity) {
      throw new Error('Domain entity is required');
    }

    const ormEntity = new RiskprofileOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.isActive = domainEntity.isActive;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    // Map your properties from camelCase to snake_case
    // Example: ormEntity.property_name = domainEntity.propertyName;
    
    return ormEntity;
  }

  toDomainEntity(ormEntity: RiskprofileOrmEntity): RiskprofileEntity {
    const entity = new RiskprofileEntity({
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