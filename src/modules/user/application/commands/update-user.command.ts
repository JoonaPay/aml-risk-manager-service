import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserUseCase } from "@modules/user/application/domain/usecases/update-user.use-case";
import { UpdateUserDto } from "@modules/user/application/dto/requests/update-user.dto";

export class UpdateUserCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: UpdateUserDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(private readonly useCase: UpdateUserUseCase) {}

  async execute(command: UpdateUserCommand) {
    return this.useCase.execute(command);
  }
}