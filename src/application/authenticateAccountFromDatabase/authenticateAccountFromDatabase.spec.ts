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
  test('Should call LoadAccountByEmail with correct email', () => {
    const { sut, loadAccountByEmailStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'load');
    sut.auth({
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    });

    expect(loadSpy).toHaveBeenCalledWith({ email: 'anyEmail@mail.com' });
  });
});
