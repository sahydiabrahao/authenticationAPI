import {
  MissingParamError,
  AddAccountController,
  ServerError,
  ValidatorInput,
  ValidatorOutput,
  ValidatorModel,
} from '@presentation';
import { AccountModel, AddAccountModel, AddAccountParamsModel } from '@domain';

type SutTypes = {
  sut: AddAccountController;
  validatorStub: ValidatorModel;
  addAccountStub: AddAccountModel;
};

const makeValidateAccountStub = (): ValidatorModel => {
  class ValidateAccountStub implements ValidatorModel {
    validate(input: ValidatorInput): ValidatorOutput {
      return Promise.resolve(null);
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

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub();
  const validatorStub = makeValidateAccountStub();
  const sut = new AddAccountController(addAccountStub, validatorStub);
  return {
    sut,
    validatorStub,
    addAccountStub,
  };
};

describe('AddAccountController', () => {
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
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
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
    jest
      .spyOn(validatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new MissingParamError('anyField')));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new MissingParamError('anyField'),
    });
  });
});
