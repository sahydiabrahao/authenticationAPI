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
    return Promise.resolve('hashedPassword');
  },
  async compare(): Promise<boolean> {
    return Promise.resolve(true);
  },
}));

describe('BcryptAdapter', () => {
  test('Should call Bcrypt hash method with correct password', async () => {
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
  test('Should throw an error when Bcrypt hash throws an error', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.hash('anyPassword');
    await expect(promise).rejects.toThrow();
  });
  test('Should call Bcrypt compare method with correct password', async () => {
    const { sut } = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('anyPassword', 'anyHash');
    expect(compareSpy).toHaveBeenCalledWith('anyPassword', 'anyHash');
  });
  test('Should return true when Bcrypt compare method success', async () => {
    const { sut } = makeSut();
    const isValid = await sut.compare('anyPassword', 'anyHash');
    expect(isValid).toEqual(true);
  });
  test('Should return false when Bcrypt compare method fails', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      Promise.resolve(false);
    });
    const isValid = await sut.compare('anyPassword', 'anyHash');
    expect(isValid).toEqual(false);
  });
  test('Should throw an error when Bcrypt compare throws an error', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.compare('anyPassword', 'anyHash');
    await expect(promise).rejects.toThrow();
  });
});
