import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InvestigationMapper } from "@modules/investigation/infrastructure/mappers/investigation.mapper";
import { InvestigationOrmEntity } from "@modules/investigation/infrastructure/orm-entities/investigation.orm-entity";
import { InvestigationEntity } from "@modules/investigation/domain/entities/investigation.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InvestigationRepository {
  constructor(
    @InjectRepository(InvestigationOrmEntity)
    private readonly repository: Repository<InvestigationOrmEntity>,
    private readonly mapper: InvestigationMapper,
  ) {}

  async create(entity: InvestigationEntity): Promise<InvestigationEntity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    const savedOrmEntity = await this.repository.save(ormEntity);
    return this.mapper.toDomainEntity(savedOrmEntity);
  }

  async findById(id: string): Promise<InvestigationEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
    });
    if (!ormEntity) {
      return null;
    }
    return this.mapper.toDomainEntity(ormEntity);
  }

  async findAll(): Promise<InvestigationEntity[]> {
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
    entity: InvestigationEntity,
  ): Promise<InvestigationEntity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    await this.repository.update(id, ormEntity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}