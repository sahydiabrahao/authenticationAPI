import {
  AuthenticateAccountController,
  InvalidParamError,
  MissingParamError,
  ServerError,
  UnauthorizedError,
} from '@presentation';
import { EmailValidatorModel } from '@utils';

import {
  AuthenticateAccountModel,
  AuthenticateAccountInput,
  AuthenticateAccountOutput,
} from '@domain';

type SutTypes = {
  sut: AuthenticateAccountController;
  emailValidatorStub: EmailValidatorModel;
  authenticateAccountStub: AuthenticateAccountModel;
};

const makeAuthenticateAccountStub = (): AuthenticateAccountModel => {
  class AuthenticateAccountStub implements AuthenticateAccountModel {
    async auth(account: AuthenticateAccountInput): Promise<AuthenticateAccountOutput> {
      return Promise.resolve('validAccessToken');
    }
  }
  return new AuthenticateAccountStub();
};
const makeEmailValidatorStub = (): EmailValidatorModel => {
  class EmailValidatorStub implements EmailValidatorModel {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
const makeSut = (): SutTypes => {
  const authenticateAccountStub = makeAuthenticateAccountStub();
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new AuthenticateAccountController(emailValidatorStub, authenticateAccountStub);
  return {
    sut,
    emailValidatorStub,
    authenticateAccountStub: authenticateAccountStub,
  };
};

describe('AuthenticateAccountController', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const controllerInput = {
      body: {
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 400,
      body: new MissingParamError('email'),
    });
  });
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const controllerInput = {
      body: {
        email: 'anyEmail@mail.com',
      },
    };
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 400,
      body: new MissingParamError('password'),
    });
  });
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      },
    };
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(controllerInput);
    expect(isValidSpy).toHaveBeenCalledWith(controllerInput.body.email);
  });
  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'invalidEmail@mail.com',
        password: 'anyPassword',
      },
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false);
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 400,
      body: new InvalidParamError('email'),
    });
  });
  test('Should return 500 if EmailValidator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'invalidEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
  test('Should call AuthenticateAccount with correct values', async () => {
    const { sut, authenticateAccountStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
      },
    };
    const authSpy = jest.spyOn(authenticateAccountStub, 'auth');
    await sut.handle(controllerInput);
    expect(authSpy).toHaveBeenCalledWith(controllerInput.body);
  });
  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticateAccountStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'invalidEmail@mail.com',
        password: 'anyPassword',
      },
    };
    jest.spyOn(authenticateAccountStub, 'auth').mockReturnValueOnce(Promise.resolve(null));
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 401,
      body: new UnauthorizedError(),
    });
  });
  test('Should return 500 if AuthenticateAccount throws an error', async () => {
    const { sut, authenticateAccountStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
      },
    };
    jest.spyOn(authenticateAccountStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()));
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
  test('Should return 200 if valid credentials is provided', async () => {
    const { sut } = makeSut();
    const controllerInput = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
      },
    };
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 200,
      body: { accessToken: 'validAccessToken' },
    });
  });
});
