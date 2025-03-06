import {
  AddAccountToDatabase,
  AddAccountToDatabaseModel,
  PasswordHasherModel,
} from '@/application';

type SutTypes = {
  sut: AddAccountToDatabaseModel;
  passwordHasherStub: PasswordHasherModel;
};

const makePasswordHasherStub = (): PasswordHasherModel => {
  class PasswordHasherStub implements PasswordHasherModel {
    async hash(password: string): Promise<string> {
      return Promise.resolve('hashedPassword');
    }
  }
  return new PasswordHasherStub();
};

const makeSut = (): SutTypes => {
  const passwordHasherStub = makePasswordHasherStub();
  const sut = new AddAccountToDatabase(passwordHasherStub);
  return {
    sut,
    passwordHasherStub,
  };
};

describe('AddAccountToDatabase', () => {
  test('Should call PasswordHasher with correct values', async () => {
    const { sut, passwordHasherStub } = makeSut();
    const validAccount = { email: 'validEamil@mail.com', password: 'validPassword' };
    const hashSpy = jest.spyOn(passwordHasherStub, 'hash');
    await sut.add(validAccount);
    expect(hashSpy).toHaveBeenCalledWith(validAccount.password);
  });
  test('Should throw an error to AddAccountController when PasswordHasher throws an error', async () => {
    const { sut, passwordHasherStub } = makeSut();
    const validAccount = { email: 'validEamil@mail.com', password: 'validPassword' };
    jest.spyOn(passwordHasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.add(validAccount);
    expect(promise).rejects.toThrow();
  });
});
