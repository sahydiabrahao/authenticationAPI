import { ServerError, EmailValidator, InvalidParamError } from '@presentation';
import { EmailValidatorModel } from '@utils';

const makeEmailValidatorStub = (): EmailValidatorModel => {
  class EmailValidatorStub implements EmailValidatorModel {
    isValid(email: string): boolean {
      return true;
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
  test('Should return error if EmailValidatorAdapter return false', () => {
    const { sut, emailValidatorAdapterStub } = makeSut();
    jest.spyOn(emailValidatorAdapterStub, 'isValid').mockReturnValueOnce(false);
    const error = sut.validate({ email: 'anyEmail@mail.com' });
    expect(error).toEqual(new InvalidParamError('email'));
  });
  test('Should call EmailValidatorAdapter with correct email', () => {
    const { sut, emailValidatorAdapterStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorAdapterStub, 'isValid');
    sut.validate({ email: 'anyEmail@mail.com' });
    expect(isValidSpy).toHaveBeenCalledWith('anyEmail@mail.com');
  });
  test('Should throws if EmailValidator throws an error', () => {
    const { sut, emailValidatorAdapterStub } = makeSut();
    jest.spyOn(emailValidatorAdapterStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    expect(() => sut.validate({ email: 'anyEmail@mail.com' })).toThrow();
  });
});
