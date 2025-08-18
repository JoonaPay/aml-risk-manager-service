import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateAmlAlertUseCase } from "@modules/aml-alert/application/domain/usecases/update-aml-alert.use-case";
import { UpdateAmlAlertDto } from "@modules/aml-alert/application/dto/requests/update-aml-alert.dto";

export class UpdateAmlAlertCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: UpdateAmlAlertDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(UpdateAmlAlertCommand)
export class UpdateAmlAlertHandler
  implements ICommandHandler<UpdateAmlAlertCommand>
{
  constructor(private readonly useCase: UpdateAmlAlertUseCase) {}

  async execute(command: UpdateAmlAlertCommand) {
    return this.useCase.execute(command);
  }
}