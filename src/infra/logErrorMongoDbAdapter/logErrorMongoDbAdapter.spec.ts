import { LogErrorMongoDbAdapter, MongoHelper } from '@infra';
import { Collection } from 'mongodb';
import { env } from '../../main/config/env';
type SutTypes = {
  sut: LogErrorMongoDbAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new LogErrorMongoDbAdapter();
  return { sut };
};

describe('LogErrorMongoDbAdapter', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoURL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollections('errors');
    await MongoHelper.clearAllCollection();
  });
  test('Should create an error log on success', async () => {
    const { sut } = makeSut();
    await sut.logError('anyStackError');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
