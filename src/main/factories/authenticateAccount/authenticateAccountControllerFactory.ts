import { AuthenticateAccountFromDatabase } from '@application';
import { LogErrorMongoDbAdapter, BcryptAdapter, MongoDbAdapter, JwtAdapter } from '@infra';
import { AuthenticateAccountController, ControllerModel } from '@presentation';
import { AuthenticateAccountValidatorFactory, LogControllerDecorator, env } from '@main';

export const AuthenticateAccountControllerFactory = (): ControllerModel => {
  const SALT = 12;
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const addAccountToDatabaseAdapter = new MongoDbAdapter();
  const passwordHasherAdapter = new BcryptAdapter(SALT);
  const authenticateAccountFromDatabase = new AuthenticateAccountFromDatabase(
    addAccountToDatabaseAdapter,
    passwordHasherAdapter,
    jwtAdapter,
    addAccountToDatabaseAdapter
  );
  const authenticateAccountController = new AuthenticateAccountController(
    authenticateAccountFromDatabase,
    AuthenticateAccountValidatorFactory()
  );
  const addLogErrorToDatabaseAdapter = new LogErrorMongoDbAdapter();
  return new LogControllerDecorator(authenticateAccountController, addLogErrorToDatabaseAdapter);
};
