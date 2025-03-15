import { AddAccountToDatabase } from '@application';
import {
  AddLogErrorToDatabaseAdapter,
  PasswordHasherAdapter,
  AddAccountToDatabaseAdapter,
} from '@infra';
import { AddAccountController, ControllerModel } from '@presentation';
import { EmailValidatorAdapter } from '@utils';
import { LogControllerDecorator } from '../../decorators/logControllerDecorator';
import { AddAccountValidatorFactory } from './addAccountValidatorFactory';

export const addAccountControllerFactory = (): ControllerModel => {
  const SALT = 12;
  const addAccountToDatabaseAdapter = new AddAccountToDatabaseAdapter();
  const passwordHasherAdapter = new PasswordHasherAdapter(SALT);
  const addAccountToDatabase = new AddAccountToDatabase(
    passwordHasherAdapter,
    addAccountToDatabaseAdapter
  );
  const addAccountController = new AddAccountController(
    addAccountToDatabase,
    AddAccountValidatorFactory()
  );
  const addLogErrorToDatabaseAdapter = new AddLogErrorToDatabaseAdapter();
  return new LogControllerDecorator(addAccountController, addLogErrorToDatabaseAdapter);
};
