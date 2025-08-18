import { UserEntity } from "@modules/user/application/domain/entities/user.entity";
import { UserRepository } from "@modules/user/infrastructure/repositories/user.repository";
import { UpdateUserCommand } from "@modules/user/application/commands/update-user.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: UpdateUserCommand) {
    const entity = new UserEntity({
      // Map command properties to entity properties
      // Example: propertyName: command.propertyName,
    });
    return this.repository.update(entity.id, entity);
  }
}