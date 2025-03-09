import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@infra';

type SutTypes = {
  sut: BcryptAdapter;
};

const SALT = 12;
const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(SALT);
  return {
    sut,
  };
};

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hashedPassword';
  },
}));

describe('BcryptAdapter', () => {
  test('Should call Bcrypt with correct password', async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('anyPassword');
    expect(hashSpy).toHaveBeenCalledWith('anyPassword', SALT);
  });
  test('Should return hashedPassword if valid data is provided', async () => {
    const { sut } = makeSut();
    const hashedPassword = await sut.hash('anyPassword');
    expect(hashedPassword).toEqual('hashedPassword');
  });
  test('Should throw an error to AddAccountController when Bcrypt throws an error', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.hash('anyPassword');
    await expect(promise).rejects.toThrow();
  });
});
