import { RiskprofileEntity } from "@modules/risk-profile/domain/entities/risk-profile.entity";
import { RiskprofileRepository } from "@modules/risk-profile/infrastructure/repositories/risk-profile.repository";
import { CreateRiskprofileCommand } from "@modules/risk-profile/application/commands/create-risk-profile.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateRiskprofileUseCase {
  constructor(private readonly repository: RiskprofileRepository) {}

  async execute(command: CreateRiskprofileCommand) {
    const entity = new RiskprofileEntity(command);
    return this.repository.create(entity);
  }
}