import { MongoHelper } from './mongoHelper';

describe('MongoHelper', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should reconnect if MongoDB is down', async () => {
    const sut = MongoHelper;
    let accountCollection = await sut.getCollections('accounts');
    expect(accountCollection).toBeTruthy();
    await MongoHelper.disconnect();
    accountCollection = await sut.getCollections('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
