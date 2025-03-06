import { EmailValidatorModel } from '@/application';
import { EmailValidatorAdapter } from '@/infra';

type SutTypes = {
  sut: EmailValidatorModel;
};

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter();
  return {
    sut,
  };
};

describe('EmailValidatorAdapter', () => {
  test('Should return false if Validator returns false', async () => {
    const { sut } = makeSut();
    jest.spyOn(sut, 'isValid').mockReturnValueOnce(Promise.resolve(false));
    const isValid = await sut.isValid('anyEmail@mail.com');
    expect(isValid).toBe(false);
  });
});
