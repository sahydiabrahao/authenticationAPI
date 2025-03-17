import {
  AuthenticateAccountFromDatabase,
  HashComparerModel,
  LoadAccountByEmailModel,
  LoadAccountByEmailOutput,
  TokenGeneratorModel,
} from '@application';

const makeTokenGeneratorStub = (): TokenGeneratorModel => {
  class TokenGeneratorStub implements TokenGeneratorModel {
    async generate(id: string): Promise<string> {
      return Promise.resolve('anyToken');
    }
  }
  return new TokenGeneratorStub();
};
const makeHashComparerStub = (): HashComparerModel => {
  class HashComparerModelStub implements HashComparerModel {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerModelStub();
};

const makeLoadAccountByEmailStub = (): LoadAccountByEmailModel => {
  class LoadAccountByEmailStub implements LoadAccountByEmailModel {
    async load(email: string): Promise<LoadAccountByEmailOutput> {
      return Promise.resolve({
        id: 'anyId',
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
  tokenGeneratorStub: TokenGeneratorModel;
};

const makeSut = (): SutTypes => {
  const tokenGeneratorStub = makeTokenGeneratorStub();
  const hashComparerStub = makeHashComparerStub();
  const loadAccountByEmailStub = makeLoadAccountByEmailStub();
  const sut = new AuthenticateAccountFromDatabase(
    loadAccountByEmailStub,
    hashComparerStub,
    tokenGeneratorStub
  );
  return {
    sut,
    loadAccountByEmailStub,
    hashComparerStub,
    tokenGeneratorStub,
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
    expect(loadSpy).toHaveBeenCalledWith('anyEmail@mail.com');
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
    expect(compareSpy).toHaveBeenCalledWith('anyPassword', 'hashedPassword');
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
  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });
    expect(generateSpy).toHaveBeenCalledWith('anyId');
  });
  test('Should throws if TokenGenerator throw an error', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });
    expect(promise).rejects.toThrow();
  });
});
