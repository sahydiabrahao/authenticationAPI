import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '@infra';

describe('AddAccountRoute', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await MongoHelper.clearAllCollection();
  });
  test('Should return 200 on success', async () => {
    await request(app)
      .post('/api/addAccount')
      .send({
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      })
      .expect(200);
  });
});
