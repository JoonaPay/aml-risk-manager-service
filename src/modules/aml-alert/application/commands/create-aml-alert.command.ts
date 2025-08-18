import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAmlAlertUseCase } from "@modules/aml-alert/application/domain/usecases/create-aml-alert.use-case";
import { CreateAmlAlertDto } from "@modules/aml-alert/application/dto/requests/create-aml-alert.dto";

export class CreateAmlAlertCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: CreateAmlAlertDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(CreateAmlAlertCommand)
export class CreateAmlAlertHandler
  implements ICommandHandler<CreateAmlAlertCommand>
{
  constructor(private readonly useCase: CreateAmlAlertUseCase) {}

  async execute(command: CreateAmlAlertCommand) {
    return this.useCase.execute(command);
  }
}