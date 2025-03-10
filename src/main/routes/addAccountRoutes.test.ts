import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '@infra';

describe('AddAccout Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await MongoHelper.clearAllCollection();
  });
  test('Should return account on success', async () => {
    await request(app)
      .post('/api/addAccount')
      .send({
        email: 'anyEamil@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      })
      .expect(200);
  });
});
