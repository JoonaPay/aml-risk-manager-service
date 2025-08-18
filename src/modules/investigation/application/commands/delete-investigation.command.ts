import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateInvestigationUseCase } from "@modules/investigation/application/usecases/create-investigation.use-case";
import { CreateInvestigationDto } from "@modules/investigation/application/dto/requests/create-investigation.dto";

export class CreateInvestigationCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: CreateInvestigationDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(CreateInvestigationCommand)
export class CreateInvestigationHandler
  implements ICommandHandler<CreateInvestigationCommand>
{
  constructor(private readonly useCase: CreateInvestigationUseCase) {}

  async execute(command: CreateInvestigationCommand) {
    return this.useCase.execute(command);
  }
}