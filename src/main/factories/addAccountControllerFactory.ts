import { AddAccountToDatabase } from '@application';
import { AddLogErroToDatabaseAdapter, BcryptAdapter, AddAccountToDatabaseAdapter } from '@infra';
import { AddAccountController, ControllerModel } from '@presentation';
import { EmailValidatorAdapter } from '@utils';
import { LogControllerDecorator } from '../decorators/logControllerDecorator';

export const addAccountControllerFactory = (): ControllerModel => {
  const SALT = 12;
  const addAccountToDatabaseAdapter = new AddAccountToDatabaseAdapter();
  const bcryptAdapter = new BcryptAdapter(SALT);
  const addAccountToDatabase = new AddAccountToDatabase(bcryptAdapter, addAccountToDatabaseAdapter);
  const emailValidator = new EmailValidatorAdapter();
  const addAccountController = new AddAccountController(emailValidator, addAccountToDatabase);
  const addLogErroToDatabaseAdapter = new AddLogErroToDatabaseAdapter();
  return new LogControllerDecorator(addAccountController, addLogErroToDatabaseAdapter);
};
