import {
  MissingParamError,
  AddAccountController,
  ServerError,
  ValidatorInput,
  ValidatorOutput,
  ValidatorModel,
} from '@presentation';
import { AddAccountOutput, AddAccountModel, AddAccountInput } from '@domain';

type SutTypes = {
  sut: AddAccountController;
  validatorStub: ValidatorModel;
  addAccountStub: AddAccountModel;
};

const makeValidateAccountStub = (): ValidatorModel => {
  class ValidateAccountStub implements ValidatorModel {
    validate(input: ValidatorInput): ValidatorOutput {
      return null;
    }
  }
  return new ValidateAccountStub();
};

const makeAddAccountStub = (): AddAccountModel => {
  class AddAccountStub implements AddAccountModel {
    async add(account: AddAccountInput): Promise<AddAccountOutput> {
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
    const controllerInput = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };

    const addSpy = jest.spyOn(addAccountStub, 'add');
    await sut.handle(controllerInput);
    expect(addSpy).toHaveBeenCalledWith({
      email: 'validEmail@mail.com',
      password: 'validPassword',
    });
  });
  test('Should return 500 if AddAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 500,
      body: new ServerError(),
    });
  });
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const controllerInput = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 200,
      body: { id: 'validId', email: 'validEmail@mail.com', password: 'validPassword' },
    });
  });
  test('Should call Validator with correct values', async () => {
    const { sut, validatorStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };

    const validateSpy = jest.spyOn(validatorStub, 'validate');
    await sut.handle(controllerInput);
    expect(validateSpy).toHaveBeenCalledWith(controllerInput.body);
  });
  test('Should return 400 if Validator throws an error', async () => {
    const { sut, validatorStub } = makeSut();
    const controllerInput = {
      body: {
        email: 'validEmail@mail.com',
        password: 'validPassword',
        passwordConfirmation: 'validPassword',
      },
    };
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('anyField'));
    const controllerOutput = await sut.handle(controllerInput);
    expect(controllerOutput).toEqual({
      statusCode: 400,
      body: new MissingParamError('anyField'),
    });
  });
});
