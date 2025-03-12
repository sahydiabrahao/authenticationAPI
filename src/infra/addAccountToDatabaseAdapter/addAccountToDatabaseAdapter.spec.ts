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
  test('Should return account if valid data is provided', async () => {
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
});
