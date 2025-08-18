import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserUseCase } from "@modules/user/application/domain/usecases/create-user.use-case";
import { CreateUserDto } from "@modules/user/application/dto/requests/create-user.dto";

export class CreateUserCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: CreateUserDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(private readonly useCase: CreateUserUseCase) {}

  async execute(command: CreateUserCommand) {
    return this.useCase.execute(command);
  }
}