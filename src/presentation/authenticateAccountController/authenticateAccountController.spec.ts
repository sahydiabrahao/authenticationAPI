import {
  AuthenticateAccountController,
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@presentation';
import { EmailValidatorModel } from '@utils';

import { AuthenticationAccountModel, AuthenticationAccountParamsModel } from '@domain';

type SutTypes = {
  sut: AuthenticateAccountController;
  emailValidatorStub: EmailValidatorModel;
  authenticationAccountStub: AuthenticationAccountModel;
};

const makeAuthenticationAccountStub = (): AuthenticationAccountModel => {
  class AuthenticationAccountStub implements AuthenticationAccountModel {
    async auth(account: AuthenticationAccountParamsModel): Promise<string> {
      return Promise.resolve('anyAccessToken');
    }
  }
  return new AuthenticationAccountStub();
};

const makeEmailValidatorStub = (): EmailValidatorModel => {
  class EmailValidatorStub implements EmailValidatorModel {
    async isValid(email: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const authtenticationAccountStub = makeAuthenticationAccountStub();
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new AuthenticateAccountController(emailValidatorStub, authtenticationAccountStub);
  return {
    sut,
    emailValidatorStub,
    authenticationAccountStub: authtenticationAccountStub,
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
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(Promise.resolve(false));
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
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(Promise.reject(new Error()));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
  test('Should call AuthentitacionAccount with correct values', async () => {
    const { sut, authenticationAccountStub: authtenticationAccountStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
      },
    };
    const authSpy = jest.spyOn(authtenticationAccountStub, 'auth');
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
