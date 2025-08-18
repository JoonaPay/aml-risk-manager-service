import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserUseCase } from "@modules/user/application/domain/usecases/delete-user.use-case";
import { DeleteUserDto } from "@modules/user/application/dto/requests/delete-user.dto";

export class DeleteUserCommand {
  // Add your command properties here
  // They should match your entity properties in camelCase
  
  constructor(
    data: DeleteUserDto,
    public readonly contextId: string, // e.g., userId, tenantId
  ) {
    // Transform snake_case DTO to camelCase command properties
    // Example: this.propertyName = data.property_name;
  }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(private readonly useCase: DeleteUserUseCase) {}

  async execute(command: DeleteUserCommand) {
    return this.useCase.execute(command);
  }
}