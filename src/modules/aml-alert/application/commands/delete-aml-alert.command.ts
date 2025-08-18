import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAmlAlertUseCase } from "@modules/aml-alert/application/domain/usecases/delete-aml-alert.use-case";
import { DeleteAmlAlertDto } from "@modules/aml-alert/application/dto/requests/delete-aml-alert.dto";

export class DeleteAmlAlertCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: DeleteAmlAlertDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(DeleteAmlAlertCommand)
export class DeleteAmlAlertHandler
  implements ICommandHandler<DeleteAmlAlertCommand>
{
  constructor(private readonly useCase: DeleteAmlAlertUseCase) {}

  async execute(command: DeleteAmlAlertCommand) {
    return this.useCase.execute(command);
  }
}