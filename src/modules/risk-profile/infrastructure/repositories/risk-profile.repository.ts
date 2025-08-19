import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RiskprofileMapper } from "@modules/risk-profile/infrastructure/mappers/risk-profile.mapper";
import { RiskprofileOrmEntity } from "@modules/risk-profile/infrastructure/orm-entities/risk-profile.orm-entity";
import { RiskProfileEntity } from "@modules/risk-profile/domain/entities/risk-profile.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RiskprofileRepository {
  constructor(
    @InjectRepository(RiskprofileOrmEntity)
    private readonly repository: Repository<RiskprofileOrmEntity>,
    private readonly mapper: RiskprofileMapper,
  ) {}

  async create(entity: RiskProfileEntity): Promise<RiskProfileEntity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    const savedOrmEntity = await this.repository.save(ormEntity);
    return this.mapper.toDomainEntity(savedOrmEntity);
  }

  async findById(id: string): Promise<RiskProfileEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
    });
    if (!ormEntity) {
      return null;
    }
    return this.mapper.toDomainEntity(ormEntity);
  }

  async findAll(): Promise<RiskProfileEntity[]> {
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
    entity: RiskProfileEntity,
  ): Promise<RiskProfileEntity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    await this.repository.update(id, ormEntity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}