import {
  MissingParamError,
  InvalidParamError,
  AddAccountController,
  ServerError,
  EmailValidatorModel,
} from '@/application';
import { AccountModel, AddAccountModel, AddAccountParamsModel } from '@/domain';

type SutTypes = {
  sut: AddAccountController;
  emailValidatorStub: EmailValidatorModel;
  addAccountStub: AddAccountModel;
};

const makeAddAccountStub = (): AddAccountModel => {
  class AddAccountStub implements AddAccountModel {
    add(account: AddAccountParamsModel): AccountModel {
      return {
        id: 'validId',
        email: 'validEmail@mail.com',
        password: 'validPassword',
      };
    }
  }
  return new AddAccountStub();
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
  const addAccountStub = makeAddAccountStub();
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new AddAccountController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe('AddAccountController', () => {
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('email'),
    });
  });
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        passwordConfirmation: 'anyPassword',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('password'),
    });
  });
  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('passwordConfirmation'),
    });
  });
  test('Should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalidEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false);
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new InvalidParamError('email'),
    });
  });
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test('Should return 500 if EmailValidator throws an error', () => {
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
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
  test('Should return 400 if the password does not match the password confirmation', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'invalidPassword',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new InvalidParamError('passwordConfirmation'),
    });
  });
  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };

    const addAccountSpy = jest.spyOn(addAccountStub, 'add');
    sut.handle(httpRequest);
    expect(addAccountSpy).toHaveBeenCalledWith({
      email: 'validEmail@mail.com',
      password: 'validPassword',
    });
  });
  test('Should return 500 if AddAccount throws an error', () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
});
