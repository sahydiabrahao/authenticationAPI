import { AddAccountToDatabase } from '@application';
import {
  AddLogErrorToDatabaseAdapter,
  PasswordHasherAdapter,
  AddAccountToDatabaseAdapter,
} from '@infra';
import { AddAccountController, ControllerModel } from '@presentation';
import { AddAccountValidatorFactory, LogControllerDecorator } from '@main';

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
