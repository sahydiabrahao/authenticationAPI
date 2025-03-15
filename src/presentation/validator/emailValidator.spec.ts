import { ServerError, EmailValidator, InvalidParamError } from '@presentation';
import { EmailValidatorModel } from '@utils';

const makeEmailValidatorStub = (): EmailValidatorModel => {
  class EmailValidatorStub implements EmailValidatorModel {
    async isValid(email: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new EmailValidatorStub();
};

type SutTypes = {
  sut: EmailValidator;
  emailValidatorAdapterStub: EmailValidatorModel;
};

const makeSut = (): SutTypes => {
  const emailValidatorAdapterStub = makeEmailValidatorStub();
  const sut = new EmailValidator('email', emailValidatorAdapterStub);
  return {
    sut,
    emailValidatorAdapterStub,
  };
};

describe('EmailValidator', () => {
  test('Should return error if EmailValidatorAdapter return false', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut();
    jest.spyOn(emailValidatorAdapterStub, 'isValid').mockReturnValueOnce(Promise.resolve(false));
    const error = await sut.validate({ email: 'anyEmail@mail.com' });
    expect(error).toEqual(new InvalidParamError('email'));
  });
  test('Should call EmailValidatorAdapter with correct email', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorAdapterStub, 'isValid');
    sut.validate({ email: 'anyEmail@mail.com' });
    expect(isValidSpy).toHaveBeenCalledWith('anyEmail@mail.com');
  });
  test('Should throws if EmailValidator throws an error', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut();
    jest
      .spyOn(emailValidatorAdapterStub, 'isValid')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.validate({ email: 'anyEmail@mail.com' });

    expect(promise).rejects.toThrow();
  });
});
