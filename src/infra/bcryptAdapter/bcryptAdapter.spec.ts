import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra';

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

bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
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
});
