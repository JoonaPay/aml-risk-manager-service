import { CreateAmlAlertHandler } from './create-aml-alert.command';
import { UpdateAmlAlertHandler } from './update-aml-alert.command';
import { DeleteAmlAlertHandler } from './delete-aml-alert.command';

export const CommandHandlers = [
  CreateAmlAlertHandler,
  UpdateAmlAlertHandler,
  DeleteAmlAlertHandler,
];
