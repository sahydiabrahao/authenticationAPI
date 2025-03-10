import { LogControllerDecorator } from '../decorators/logControllerDecorator';
import { ControllerModel, HttpRequestModel, HttpResponseModel } from '@presentation';

class ControllerStub implements ControllerModel {
  async handle(httpRequest: HttpRequestModel): Promise<HttpResponseModel> {
    const httpResponse: HttpResponseModel = {
      statusCode: 500,
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      },
    };
    return Promise.resolve(httpResponse);
  }
}

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: ControllerStub;
};

const makeSut = (): SutTypes => {
  const controllerStub = new ControllerStub();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
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
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      },
    });
  });
});
