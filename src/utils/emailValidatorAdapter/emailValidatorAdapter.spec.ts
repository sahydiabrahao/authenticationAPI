import { EmailValidatorAdapter, EmailValidatorModel } from '@/utils';
import validator from 'validator';

type SutTypes = {
  sut: EmailValidatorModel;
};

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter();
  return {
    sut,
  };
};

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidatorAdapter', () => {
  test('Should return false if Validator returns false', async () => {
    const { sut } = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = await sut.isValid('anyEmail@mail.com');
    expect(isValid).toBe(false);
  });
  test('Should return true if Validator returns true', async () => {
    const { sut } = makeSut();
    const isValid = await sut.isValid('anyEmail@mail.com');
    expect(isValid).toBe(true);
  });
  test('Should call Validator with correct value', async () => {
    const { sut } = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    await sut.isValid('anyEmail@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('anyEmail@mail.com');
  });
});
