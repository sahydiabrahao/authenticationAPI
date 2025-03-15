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
  AuthenticateAccountParamsModel,
  AuthenticateModel,
} from '@domain';

type SutTypes = {
  sut: AuthenticateAccountController;
  emailValidatorStub: EmailValidatorModel;
  authenticateAccountStub: AuthenticateAccountModel;
};

const makeAuthenticateAccountStub = (): AuthenticateAccountModel => {
  class AuthenticateAccountStub implements AuthenticateAccountModel {
    async auth(account: AuthenticateAccountParamsModel): Promise<AuthenticateModel> {
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
    const httpRequest = {
      body: {
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('email'),
    });
  });
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('password'),
    });
  });
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      },
    };
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalidEmail@mail.com',
        password: 'anyPassword',
      },
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new InvalidParamError('email'),
    });
  });
  test('Should return 500 if EmailValidator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalidEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
  test('Should call AuthenticateAccount with correct values', async () => {
    const { sut, authenticateAccountStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
      },
    };
    const authSpy = jest.spyOn(authenticateAccountStub, 'auth');
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticateAccountStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalidEmail@mail.com',
        password: 'anyPassword',
      },
    };
    jest.spyOn(authenticateAccountStub, 'auth').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: new UnauthorizedError(),
    });
  });
  test('Should return 500 if AuthenticateAccount throws an error', async () => {
    const { sut, authenticateAccountStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
      },
    };
    jest.spyOn(authenticateAccountStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
  test('Should return 200 if valid credentials is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: { accessToken: 'validAccessToken' },
    });
  });
});
