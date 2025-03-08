import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra';

// bcrypt.hash = jest.fn().mockResolvedValue('hashedValue');

type SutTypes = {
  sut: BcryptAdapter;
};

const makeSut = (): SutTypes => {
  const SALT = 12;
  const sut = new BcryptAdapter(SALT);
  return {
    sut,
  };
};

describe('BcryptAdapter', () => {
  test('Should call Bcrypt with correct password', async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('anyPassword');
    expect(hashSpy).toHaveBeenCalledWith('anyPassword', 12);
  });
});
