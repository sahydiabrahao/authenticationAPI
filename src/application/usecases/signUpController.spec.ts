import { SignUpController } from '@/application';

type SutTypes = {
  sut: SignUpController;
};

const makeSut = (): SutTypes => {
  const sut = new SignUpController();
  return {
    sut,
  };
};

describe('SignUpController', () => {
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
      body: new Error('Missing param: email'),
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
      body: new Error('Missing param: password'),
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
      body: new Error('Missing param: password confirmation'),
    });
  });
  test('Should return 400 if no password and passwordConfirmation is not equal provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new Error('Missing param: password confirmation'),
    });
  });
});
