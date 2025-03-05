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
    });
  });
});
