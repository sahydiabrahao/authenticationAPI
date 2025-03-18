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

describe('JwtAdapter', () => {
  test('Should call Jwt sign method with correct values', async () => {
    const { sut } = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.generate('anyId');
    expect(signSpy).toHaveBeenCalledWith({ id: 'anyId' }, SECRET_KEY);
  });
});
