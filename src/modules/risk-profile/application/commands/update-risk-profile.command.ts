import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateRiskprofileUseCase } from "@modules/risk-profile/application/usecases/create-risk-profile.use-case";
import { CreateRiskprofileDto } from "@modules/risk-profile/application/dto/requests/create-risk-profile.dto";

export class CreateRiskprofileCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: CreateRiskprofileDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(CreateRiskprofileCommand)
export class CreateRiskprofileHandler
  implements ICommandHandler<CreateRiskprofileCommand>
{
  constructor(private readonly useCase: CreateRiskprofileUseCase) {}

  async execute(command: CreateRiskprofileCommand) {
    return this.useCase.execute(command);
  }
}