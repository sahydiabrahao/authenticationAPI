import { MongoDbAdapter, MongoHelper } from '@infra';
import { env } from '../../main/config/env';

type SutTypes = {
  sut: MongoDbAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new MongoDbAdapter();
  return { sut };
};

describe('MongoDbAdapter', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoURL);
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
  test('Should update access token account on updateAccessToken method success', async () => {
    const { sut } = makeSut();
    const accountInput = {
      email: 'anyEmail@mail.com',
      password: 'anyPassword',
    };
    const accountCollection = await MongoHelper.getCollections('accounts');
    const { insertedId } = await accountCollection.insertOne(accountInput);
    await sut.updateAccessToken(insertedId.toString(), 'anyAccessToken');
    const account = await accountCollection.findOne(insertedId);
    if (account) expect(account.accessToken).toEqual('anyAccessToken');
  });
});
