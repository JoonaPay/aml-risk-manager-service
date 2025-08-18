import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RiskassessmentMapper } from "@modules/risk-assessment/infrastructure/mappers/risk-assessment.mapper";
import { RiskassessmentOrmEntity } from "@modules/risk-assessment/infrastructure/orm-entities/risk-assessment.orm-entity";
import { RiskassessmentEntity } from "@modules/risk-assessment/domain/entities/risk-assessment.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RiskassessmentRepository {
  constructor(
    @InjectRepository(RiskassessmentOrmEntity)
    private readonly repository: Repository<RiskassessmentOrmEntity>,
    private readonly mapper: RiskassessmentMapper,
  ) {}

  async create(entity: RiskassessmentEntity): Promise<RiskassessmentEntity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    const savedOrmEntity = await this.repository.save(ormEntity);
    return this.mapper.toDomainEntity(savedOrmEntity);
  }

  async findById(id: string): Promise<RiskassessmentEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
    });
    if (!ormEntity) {
      return null;
    }
    return this.mapper.toDomainEntity(ormEntity);
  }

  async findAll(): Promise<RiskassessmentEntity[]> {
    const ormEntities = await this.repository.find();
    if (!ormEntities) {
      return [];
    }
    return ormEntities.map((ormEntity) =>
      this.mapper.toDomainEntity(ormEntity),
    );
  }

  async update(
    id: string,
    entity: RiskassessmentEntity,
  ): Promise<RiskassessmentEntity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    await this.repository.update(id, ormEntity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}