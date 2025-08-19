import { AmlAlertEntity } from "@modules/aml-alert/application/domain/entities/aml-alert.entity";
import { AmlAlertRepository } from "@modules/aml-alert/infrastructure/repositories/aml-alert.repository";
import { UpdateAmlAlertCommand } from "@modules/aml-alert/application/commands/update-aml-alert.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateAmlAlertUseCase {
  constructor(private readonly repository: AmlAlertRepository) {}

  async execute(command: UpdateAmlAlertCommand) {
    // TODO: Implement proper entity update with business logic
    throw new Error('Not implemented');
  }
}