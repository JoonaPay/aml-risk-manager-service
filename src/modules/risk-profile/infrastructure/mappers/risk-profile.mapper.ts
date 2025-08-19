import { RiskprofileOrmEntity } from "@modules/risk-profile/infrastructure/orm-entities/risk-profile.orm-entity";
import { RiskProfileEntity } from "@modules/risk-profile/domain/entities/risk-profile.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RiskprofileMapper {
  toOrmEntity(domainEntity: RiskProfileEntity): RiskprofileOrmEntity {
    if (!domainEntity) {
      throw new Error('Domain entity is required');
    }

    const ormEntity = new RiskprofileOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.isActive = domainEntity.isActive;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    // ormEntity.deletedAt = domainEntity.deletedAt; // Property may not exist on entity
    // Map your properties from camelCase to snake_case
    // Example: ormEntity.property_name = domainEntity.propertyName;
    
    return ormEntity;
  }

  toDomainEntity(ormEntity: RiskprofileOrmEntity): RiskProfileEntity {
    // TODO: Implement proper mapping from ORM to domain entity
    throw new Error('Not implemented');
  }
}