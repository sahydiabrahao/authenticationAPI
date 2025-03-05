import { MissingParamError, InvalidParamError, AddAccountController } from '@/application';

type SutTypes = {
  sut: AddAccountController;
  emailValidatorStub: EmailValidatorStub;
};

class EmailValidatorStub {
  isValid(email: string): boolean {
    return true;
  }
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new AddAccountController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
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
});
