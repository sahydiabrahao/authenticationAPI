import { AddAccountToDatabase } from '@application';
import { LogErrorMongoDbAdapter, BcryptAdapter, MongoDbAdapter } from '@infra';
import { AddAccountController, ControllerModel } from '@presentation';
import { AddAccountValidatorFactory, LogControllerDecorator } from '@main';

export const addAccountControllerFactory = (): ControllerModel => {
  const SALT = 12;
  const addAccountToDatabaseAdapter = new MongoDbAdapter();
  const passwordHasherAdapter = new BcryptAdapter(SALT);
  const addAccountToDatabase = new AddAccountToDatabase(
    passwordHasherAdapter,
    addAccountToDatabaseAdapter
  );
  const addAccountController = new AddAccountController(
    addAccountToDatabase,
    AddAccountValidatorFactory()
  );
  const addLogErrorToDatabaseAdapter = new LogErrorMongoDbAdapter();
  return new LogControllerDecorator(addAccountController, addLogErrorToDatabaseAdapter);
};
