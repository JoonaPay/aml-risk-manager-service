import { UserEntity } from "@modules/user/application/domain/entities/user.entity";
import { UserRepository } from "@modules/user/infrastructure/repositories/user.repository";
import { DeleteUserCommand } from "@modules/user/application/commands/delete-user.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: DeleteUserCommand) {
    // For delete, we typically just need the ID from the command
    return this.repository.delete(command.contextId);
  }
}