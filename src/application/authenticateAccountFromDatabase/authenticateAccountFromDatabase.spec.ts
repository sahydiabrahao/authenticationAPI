import {
  AuthenticateAccountFromDatabase,
  LoadAccountByEmailInput,
  LoadAccountByEmailModel,
  LoadAccountByEmailOutput,
} from '@application';

const makeLoadAccountByEmailStub = (): LoadAccountByEmailModel => {
  class LoadAccountByEmailStub implements LoadAccountByEmailModel {
    async load(email: LoadAccountByEmailInput): Promise<LoadAccountByEmailOutput> {
      return Promise.resolve({ id: 'anyID', email: 'anyEmail@mail.com', password: 'anyPassword' });
    }
  }
  return new LoadAccountByEmailStub();
};

type SutTypes = {
  sut: AuthenticateAccountFromDatabase;
  loadAccountByEmailStub: LoadAccountByEmailModel;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeLoadAccountByEmailStub();
  const sut = new AuthenticateAccountFromDatabase(loadAccountByEmailStub);
  return {
    sut,
    loadAccountByEmailStub,
  };
};

describe('AuthenticateAccountFromDatabase', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountByEmailStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'load');
    await sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });
    expect(loadSpy).toHaveBeenCalledWith({ email: 'anyEmail@mail.com' });
  });
  test('Should throws if LoadAccountByEmail throw an error', async () => {
    const { sut, loadAccountByEmailStub } = makeSut();
    jest.spyOn(loadAccountByEmailStub, 'load').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });
    expect(promise).rejects.toThrow();
  });
  test('Should return null if LoadAccountByEmail returns null', async () => {
    const { sut, loadAccountByEmailStub } = makeSut();
    jest.spyOn(loadAccountByEmailStub, 'load').mockReturnValueOnce(Promise.resolve(null));
    const accessToken = await sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });
    expect(accessToken).toEqual(null);
  });
});
