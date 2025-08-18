import { RiskassessmentOrmEntity } from "@modules/risk-assessment/infrastructure/orm-entities/risk-assessment.orm-entity";
import { RiskassessmentEntity } from "@modules/risk-assessment/domain/entities/risk-assessment.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RiskassessmentMapper {
  toOrmEntity(domainEntity: RiskassessmentEntity): RiskassessmentOrmEntity {
    if (!domainEntity) {
      throw new Error('Domain entity is required');
    }

    const ormEntity = new RiskassessmentOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.isActive = domainEntity.isActive;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    ormEntity.deletedAt = domainEntity.deletedAt;
    // Map your properties from camelCase to snake_case
    // Example: ormEntity.property_name = domainEntity.propertyName;
    
    return ormEntity;
  }

  toDomainEntity(ormEntity: RiskassessmentOrmEntity): RiskassessmentEntity {
    const entity = new RiskassessmentEntity({
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