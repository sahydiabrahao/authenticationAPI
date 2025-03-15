import { AddLogErrorToDatabaseModel } from '@application';
import { LogControllerDecorator } from '../decorators/logControllerDecorator';
import { ControllerModel, ControllerInput, ControllerOutput, ServerError } from '@presentation';

class AddLogErrorToDatabaseStub implements AddLogErrorToDatabaseModel {
  async logError(stackError: string): Promise<void> {
    return Promise.resolve();
  }
}
class ControllerStub implements ControllerModel {
  async handle(controllerInput: ControllerInput): Promise<ControllerOutput> {
    const controllerOutput: ControllerOutput = {
      statusCode: 500,
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      },
    };
    return Promise.resolve(controllerOutput);
  }
}

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: ControllerModel;
  addLogErrorToDatabaseStub: AddLogErrorToDatabaseModel;
};

const makeSut = (): SutTypes => {
  const addLogErrorToDatabaseStub = new AddLogErrorToDatabaseStub();
  const controllerStub = new ControllerStub();
  const sut = new LogControllerDecorator(controllerStub, addLogErrorToDatabaseStub);
  return {
    sut,
    controllerStub,
    addLogErrorToDatabaseStub,
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle with correct values', async () => {
    const { sut, controllerStub } = makeSut();
    const request = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword',
      },
    };
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(request);
    expect(handleSpy).toHaveBeenCalledWith(request);
  });
  test('Should return the same result od the controller', async () => {
    const { sut } = makeSut();
    const request = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    const controllerOutput = await sut.handle(request);
    expect(controllerOutput).toEqual({
      statusCode: 500,
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      },
    });
  });
  test('Should call AddLogErrorToDatabase with correct error if controller returns ServerError', async () => {
    const { sut, controllerStub, addLogErrorToDatabaseStub } = makeSut();
    const request = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    const fakeError = new ServerError();
    fakeError.stack = 'anyStackError';
    const error = { statusCode: 500, body: fakeError };
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error));
    const logSpy = jest.spyOn(addLogErrorToDatabaseStub, 'logError');
    await sut.handle(request);
    expect(logSpy).toHaveBeenCalledWith('anyStackError');
  });
});
