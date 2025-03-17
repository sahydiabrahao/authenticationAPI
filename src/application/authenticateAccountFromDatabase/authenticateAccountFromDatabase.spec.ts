import {
  AuthenticateAccountFromDatabase,
  HashComparerInput,
  HashComparerModel,
  LoadAccountByEmailInput,
  LoadAccountByEmailModel,
  LoadAccountByEmailOutput,
} from '@application';

const makeHashComparerStub = (): HashComparerModel => {
  class HashComparerModelStub implements HashComparerModel {
    async compare(params: HashComparerInput): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerModelStub();
};

const makeLoadAccountByEmailStub = (): LoadAccountByEmailModel => {
  class LoadAccountByEmailStub implements LoadAccountByEmailModel {
    async load(email: LoadAccountByEmailInput): Promise<LoadAccountByEmailOutput> {
      return Promise.resolve({
        id: 'anyID',
        email: 'anyEmail@mail.com',
        password: 'hashedPassword',
      });
    }
  }
  return new LoadAccountByEmailStub();
};

type SutTypes = {
  sut: AuthenticateAccountFromDatabase;
  loadAccountByEmailStub: LoadAccountByEmailModel;
  hashComparerStub: HashComparerModel;
};

const makeSut = (): SutTypes => {
  const hashComparerStub = makeHashComparerStub();
  const loadAccountByEmailStub = makeLoadAccountByEmailStub();
  const sut = new AuthenticateAccountFromDatabase(loadAccountByEmailStub, hashComparerStub);
  return {
    sut,
    loadAccountByEmailStub,
    hashComparerStub,
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
  test('Should call HashedComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });
    expect(compareSpy).toHaveBeenCalledWith({
      value: 'anyPassword',
      hash: 'hashedPassword',
    });
  });
  test('Should throws if HashedComparer throw an error', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });
    expect(promise).rejects.toThrow();
  });
  test('Should return null if HashedComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false));
    const accessToken = await sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });
    expect(accessToken).toEqual(null);
  });
});
