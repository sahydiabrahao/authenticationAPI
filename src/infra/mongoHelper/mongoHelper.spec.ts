import { MongoHelper } from './mongoHelper';
import { env } from '../../main/config/env';

describe('MongoHelper', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoURL);
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
  test('Should throw an error if getConnection is called without a connection', async () => {
    await MongoHelper.disconnect();
    expect(() => MongoHelper.getConnection()).toThrow('No MongoDB connection');
  });
});
