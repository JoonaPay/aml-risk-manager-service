import { AmlAlertEntity } from "@modules/aml-alert/application/domain/entities/aml-alert.entity";
import { AmlAlertRepository } from "@modules/aml-alert/infrastructure/repositories/aml-alert.repository";
import { DeleteAmlAlertCommand } from "@modules/aml-alert/application/commands/delete-aml-alert.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteAmlAlertUseCase {
  constructor(private readonly repository: AmlAlertRepository) {}

  async execute(command: DeleteAmlAlertCommand) {
    // For delete, we typically just need the ID from the command
    return this.repository.delete(command.contextId);
  }
}