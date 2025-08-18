import { UserEntity } from "@modules/user/application/domain/entities/user.entity";
import { UserRepository } from "@modules/user/infrastructure/repositories/user.repository";
import { CreateUserCommand } from "@modules/user/application/commands/create-user.command";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    const entity = new UserEntity({
      // Map command properties to entity properties
      // Example: propertyName: command.propertyName,
    });
    return this.repository.create(entity);
  }
}