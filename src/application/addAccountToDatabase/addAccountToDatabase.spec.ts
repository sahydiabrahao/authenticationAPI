import {
  AddAccountToDatabase,
  AddAccountToDatabaseModel,
  PasswordHasherModel,
} from '@/application';
import { AccountModel, AddAccountParamsModel } from '@/domain';

type SutTypes = {
  sut: AddAccountToDatabaseModel;
  passwordHasherStub: PasswordHasherModel;
  addAccountToDatabaseStub: AddAccountToDatabaseModel;
};

const makePasswordHasherStub = (): PasswordHasherModel => {
  class PasswordHasherStub implements PasswordHasherModel {
    async hash(password: string): Promise<string> {
      return Promise.resolve('hashedPassword');
    }
  }
  return new PasswordHasherStub();
};
const makeAddAccountToDatabaseStub = (): AddAccountToDatabaseModel => {
  class AddAccountToDatabaseStub implements AddAccountToDatabaseModel {
    async add(account: AddAccountParamsModel): Promise<AccountModel> {
      return Promise.resolve({
        id: 'validId',
        email: 'validEmail',
        password: 'hashedPassword',
      });
    }
  }
  return new AddAccountToDatabaseStub();
};

const makeSut = (): SutTypes => {
  const passwordHasherStub = makePasswordHasherStub();
  const addAccountToDatabaseStub = makeAddAccountToDatabaseStub();
  const sut = new AddAccountToDatabase(passwordHasherStub, addAccountToDatabaseStub);
  return {
    sut,
    passwordHasherStub,
    addAccountToDatabaseStub,
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
  test('Should call addAccountToDatabaseAdapter with correct account', async () => {
    const { sut, addAccountToDatabaseStub } = makeSut();
    const validAccount = { email: 'validEamil@mail.com', password: 'validPassword' };
    const addSpy = jest.spyOn(addAccountToDatabaseStub, 'add');
    await sut.add(validAccount);
    expect(addSpy).toHaveBeenCalledWith({
      email: 'validEamil@mail.com',
      password: 'hashedPassword',
    });
  });
  test('Should throw an error to AddAccountController when addAccountToDatabaseAdapter throws an error', async () => {
    const { sut, addAccountToDatabaseStub } = makeSut();
    const validAccount = { email: 'validEamil@mail.com', password: 'validPassword' };
    jest.spyOn(addAccountToDatabaseStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.add(validAccount);
    expect(promise).rejects.toThrow();
  });
});
