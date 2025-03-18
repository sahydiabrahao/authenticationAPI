import { JwtAdapter } from '@infra';
import jwt from 'jsonwebtoken';

type SutTypes = {
  sut: JwtAdapter;
};

const SECRET_KEY = 'secret';
const makeSut = (): SutTypes => {
  const sut = new JwtAdapter(SECRET_KEY);
  return {
    sut,
  };
};

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return Promise.resolve('AnyToken');
  },
}));

describe('JwtAdapter', () => {
  test('Should call Jwt sign method with correct values', async () => {
    const { sut } = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.generate('anyId');
    expect(signSpy).toHaveBeenCalledWith({ id: 'anyId' }, SECRET_KEY);
  });
  test('Should return a token when Jwt sign method success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.generate('anyId');
    expect(accessToken).toEqual('AnyToken');
  });
  test('Should throw an error when Jwt sign throws an error', async () => {
    const { sut } = makeSut();
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.generate('anyId');
    await expect(promise).rejects.toThrow();
  });
});
