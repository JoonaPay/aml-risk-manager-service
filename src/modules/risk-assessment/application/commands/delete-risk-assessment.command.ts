import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateRiskassessmentUseCase } from "@modules/risk-assessment/application/usecases/create-risk-assessment.use-case";
import { CreateRiskassessmentDto } from "@modules/risk-assessment/application/dto/requests/create-risk-assessment.dto";

export class CreateRiskassessmentCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: CreateRiskassessmentDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(CreateRiskassessmentCommand)
export class CreateRiskassessmentHandler
  implements ICommandHandler<CreateRiskassessmentCommand>
{
  constructor(private readonly useCase: CreateRiskassessmentUseCase) {}

  async execute(command: CreateRiskassessmentCommand) {
    return this.useCase.execute(command);
  }
}