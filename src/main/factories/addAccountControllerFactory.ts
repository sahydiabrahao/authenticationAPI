import { AddAccountToDatabase } from '@application';
import { BcryptAdapter, MongoDbAdapter } from '@infra';
import { AddAccountController } from '@presentation';
import { EmailValidatorAdapter } from '@utils';

export const addAccountControllerFactory = (): AddAccountController => {
  const SALT = 12;
  const mongoDbAdapter = new MongoDbAdapter();
  const bcryptAdapter = new BcryptAdapter(SALT);
  const addAccountToDatabase = new AddAccountToDatabase(bcryptAdapter, mongoDbAdapter);
  const emailValidator = new EmailValidatorAdapter();
  return new AddAccountController(emailValidator, addAccountToDatabase);
};
