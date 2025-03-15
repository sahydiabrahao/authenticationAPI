import {
  AuthenticateAccountController,
  MissingParamError,
  ServerError,
  UnauthorizedError,
  ValidatorInput,
  ValidatorModel,
  ValidatorOutput,
} from '@presentation';

import {
  AuthenticateAccountModel,
  AuthenticateAccountInput,
  AuthenticateAccountOutput,
} from '@domain';

type SutTypes = {
  sut: AuthenticateAccountController;
  authenticateAccountStub: AuthenticateAccountModel;
  validatorStub: ValidatorModel;
};

const makeAuthenticateAccountStub = (): AuthenticateAccountModel => {
  class AuthenticateAccountStub implements AuthenticateAccountModel {
    async auth(account: AuthenticateAccountInput): Promise<AuthenticateAccountOutput> {
      return Promise.resolve('validAccessToken');
    }
  }
  return new AuthenticateAccountStub();
};

const makeValidateAccountStub = (): ValidatorModel => {
  class ValidateAccountStub implements ValidatorModel {
    validate(input: ValidatorInput): ValidatorOutput {
      return null;
    }
  }
  return new ValidateAccountStub();
};
const makeSut = (): SutTypes => {
  const authenticateAccountStub = makeAuthenticateAccountStub();
  const validatorStub = makeValidateAccountStub();
  const sut = new AuthenticateAccountController(authenticateAccountStub, validatorStub);
  return {
    sut,
    authenticateAccountStub,
    validatorStub,
  };
};

describe('AuthenticateAccountController', () => {
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
