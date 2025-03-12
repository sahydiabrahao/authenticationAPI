import { AddAccountToDatabase } from '@application';
import {
  AddLogErroToDatabaseAdapter,
  PasswordHasherAdapter,
  AddAccountToDatabaseAdapter,
} from '@infra';
import { AddAccountController, ControllerModel } from '@presentation';
import { EmailValidatorAdapter } from '@utils';
import { LogControllerDecorator } from '../decorators/logControllerDecorator';

export const addAccountControllerFactory = (): ControllerModel => {
  const SALT = 12;
  const addAccountToDatabaseAdapter = new AddAccountToDatabaseAdapter();
  const passwordHasherAdapter = new PasswordHasherAdapter(SALT);
  const addAccountToDatabase = new AddAccountToDatabase(
    passwordHasherAdapter,
    addAccountToDatabaseAdapter
  );
  const emailValidator = new EmailValidatorAdapter();
  const addAccountController = new AddAccountController(emailValidator, addAccountToDatabase);
  const addLogErroToDatabaseAdapter = new AddLogErroToDatabaseAdapter();
  return new LogControllerDecorator(addAccountController, addLogErroToDatabaseAdapter);
};
