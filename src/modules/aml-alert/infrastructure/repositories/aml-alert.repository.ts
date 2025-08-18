import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AmlAlertMapper } from "@modules/aml-alert/infrastructure/mappers/aml-alert.mapper";
import { AmlAlertOrmEntity } from "@modules/aml-alert/infrastructure/orm-entities/aml-alert.orm-entity";
import { AmlAlertEntity } from "@modules/aml-alert/application/domain/entities/aml-alert.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AmlAlertRepository {
  constructor(
    @InjectRepository(AmlAlertOrmEntity)
    private readonly repository: Repository<AmlAlertOrmEntity>,
    private readonly mapper: AmlAlertMapper,
  ) {}

  async create(entity: AmlAlertEntity): Promise<AmlAlertEntity> {
    const ormEntity = this.mapper.toOrm(entity);
    const savedOrmEntity = await this.repository.save(ormEntity);
    return this.mapper.toDomain(savedOrmEntity);
  }

  async findById(id: string): Promise<AmlAlertEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
    });
    if (!ormEntity) {
      return null;
    }
    return this.mapper.toDomain(ormEntity);
  }

  async findAll(): Promise<AmlAlertEntity[]> {
    const ormEntities = await this.repository.find();
    if (!ormEntities) {
      return [];
    }
    return ormEntities.map((ormEntity) =>
      this.mapper.toDomain(ormEntity),
    );
  }

  async update(
    id: string,
    entity: AmlAlertEntity,
  ): Promise<AmlAlertEntity> {
    const ormEntity = this.mapper.toOrm(entity);
    await this.repository.update(id, ormEntity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}