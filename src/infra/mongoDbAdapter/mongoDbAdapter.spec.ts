import { MongoDbAdapter, MongoHelper } from '@/infra';

type SutTypes = {
  sut: MongoDbAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new MongoDbAdapter();
  return { sut };
};

describe('MongoDbAdapter', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/jest');
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
