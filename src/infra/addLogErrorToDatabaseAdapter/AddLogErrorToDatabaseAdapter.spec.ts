import { AddLogErroToDatabaseAdapter, MongoHelper } from '@infra';
import { Collection } from 'mongodb';

type SutTypes = {
  sut: AddLogErroToDatabaseAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new AddLogErroToDatabaseAdapter();
  return { sut };
};

describe('AddLogErroToDatabaseAdapter', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
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
    console.log(count);
    expect(count).toBe(1);
  });
});
