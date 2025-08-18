import { CreateUserHandler } from './create-user.command';
import { UpdateUserHandler } from './update-user.command';
import { DeleteUserHandler } from './delete-user.command';

export const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];
