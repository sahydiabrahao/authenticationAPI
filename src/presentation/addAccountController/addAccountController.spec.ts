import {
  MissingParamError,
  InvalidParamError,
  AddAccountController,
  ServerError,
  ValidatorInput,
  ValidatorOutput,
  ValidatorModel,
} from '@presentation';
import { AccountModel, AddAccountModel, AddAccountParamsModel } from '@domain';
import { EmailValidatorModel } from '@utils';

type SutTypes = {
  sut: AddAccountController;
  emailValidatorStub: EmailValidatorModel;
  validatorStub: ValidatorModel;
  addAccountStub: AddAccountModel;
};

const makeValidateAccountStub = (): ValidatorModel => {
  class ValidateAccountStub implements ValidatorModel {
    validate(account: ValidatorInput): ValidatorOutput {
      return null;
    }
  }
  return new ValidateAccountStub();
};

const makeAddAccountStub = (): AddAccountModel => {
  class AddAccountStub implements AddAccountModel {
    async add(account: AddAccountParamsModel): Promise<AccountModel> {
      return Promise.resolve({ id: 'validId', ...account });
    }
  }
  return new AddAccountStub();
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
  const addAccountStub = makeAddAccountStub();
  const emailValidatorStub = makeEmailValidatorStub();
  const validatorStub = makeValidateAccountStub();
  const sut = new AddAccountController(emailValidatorStub, addAccountStub, validatorStub);
  return {
    sut,
    emailValidatorStub,

    validatorStub,
    addAccountStub,
  };
};

describe('AddAccountController', () => {
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
        passwordConfirmation: 'anyPassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('password'),
    });
  });
  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('passwordConfirmation'),
    });
  });
  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalidEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(Promise.resolve(false));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new InvalidParamError('email'),
    });
  });
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
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
  test('Should return 400 if the password does not match the password confirmation', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'invalidPassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new InvalidParamError('passwordConfirmation'),
    });
  });
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };

    const addSpy = jest.spyOn(addAccountStub, 'add');
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      email: 'validEmail@mail.com',
      password: 'validPassword',
    });
  });
  test('Should return 500 if AddAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: { id: 'validId', email: 'validEmail@mail.com', password: 'validPassword' },
    });
  });
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };

    const validateSpy = jest.spyOn(validatorStub, 'validate');
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest);
  });
  test('Should return 400 if Validator throws an error', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('anyField'));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('anyField'),
    });
  });
});
