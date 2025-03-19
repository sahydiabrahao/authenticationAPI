import { AddAccountToDatabaseAdapter, MongoHelper } from '@infra';

type SutTypes = {
  sut: AddAccountToDatabaseAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new AddAccountToDatabaseAdapter();
  return { sut };
};

describe('AddAccountToDatabaseAdapter', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await MongoHelper.clearAllCollection();
  });
  test('Should return account on add method success', async () => {
    const { sut } = makeSut();
    const account = {
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    };
    const newAccount = await sut.add(account);
    expect(newAccount).toBeTruthy();
    expect(newAccount.id).toBeTruthy();
    expect(newAccount.email).toBe(account.email);
    expect(newAccount.password).toBe(account.password);
  });
  test('Should return account on loadByEmail method success', async () => {
    const { sut } = makeSut();
    const account = {
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    };
    const accountCollection = await MongoHelper.getCollections('accounts');
    await accountCollection.insertOne(account);
    const accountInDatabase = await sut.loadByEmail('anyEmail@mail.com');
    expect(accountInDatabase).not.toBeNull();
  });
  test('Should return null if loadByEmail fails', async () => {
    const { sut } = makeSut();
    const accountInDatabase = await sut.loadByEmail('anyEmail@mail.com');
    expect(accountInDatabase).toBeNull();
  });
});
