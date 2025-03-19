import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '@infra';
import { hash } from 'bcrypt';
import { env } from '../../main/config/env';
describe('AuthenticateAccountRoute', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoURL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await MongoHelper.clearAllCollection();
  });
  test('Should return 200 on success', async () => {
    const password = await hash('anyPassword', 12);
    const accountInput = {
      email: 'anyEmail@mail.com',
      password: password,
    };
    const accountCollection = await MongoHelper.getCollections('accounts');
    await accountCollection.insertOne(accountInput);
    await request(app)
      .post('/api/authenticateAccount')
      .send({
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
      })
      .expect(200);
  });
});
