import { AmlAlertEntity } from "@modules/aml-alert/application/domain/entities/aml-alert.entity";
import { AmlAlertRepository } from "@modules/aml-alert/infrastructure/repositories/aml-alert.repository";
import { CreateAmlAlertCommand } from "@modules/aml-alert/application/commands/create-aml-alert.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateAmlAlertUseCase {
  constructor(private readonly repository: AmlAlertRepository) {}

  async execute(command: CreateAmlAlertCommand) {
    // TODO: Implement proper entity creation with business logic
    throw new Error('Not implemented');
  }
}