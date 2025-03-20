import { ValidatorAdapter, EmailValidatorModel } from '@utils';
import validator from 'validator';

type SutTypes = {
  sut: EmailValidatorModel;
};

const makeSut = (): SutTypes => {
  const sut = new ValidatorAdapter();
  return {
    sut,
  };
};

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('ValidatorAdapter', () => {
  test('Should return false if Validator returns false', () => {
    const { sut } = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('anyEmail@mail.com');
    expect(isValid).toBe(false);
  });
  test('Should return true if Validator returns true', () => {
    const { sut } = makeSut();
    const isValid = sut.isValid('anyEmail@mail.com');
    expect(isValid).toBe(true);
  });
  test('Should call Validator with correct value', () => {
    const { sut } = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('anyEmail@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('anyEmail@mail.com');
  });
});
