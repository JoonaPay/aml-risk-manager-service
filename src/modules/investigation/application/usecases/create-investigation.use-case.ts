import { InvestigationEntity } from "@modules/investigation/domain/entities/investigation.entity";
import { InvestigationRepository } from "@modules/investigation/infrastructure/repositories/investigation.repository";
import { CreateInvestigationCommand } from "@modules/investigation/application/commands/create-investigation.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateInvestigationUseCase {
  constructor(private readonly repository: InvestigationRepository) {}

  async execute(command: CreateInvestigationCommand) {
    // TODO: Implement proper entity creation with business logic
    throw new Error('Not implemented');
    // Repository call removed
  }
}