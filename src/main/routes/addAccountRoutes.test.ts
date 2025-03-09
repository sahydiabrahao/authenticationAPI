import request from 'supertest';
import app from '../../main';

describe('AddAccout Routes', () => {
  test('Should return account on success', async () => {
    await request(app)
      .post('/api/addAccount')
      .send({
        email: 'anyEamil@mail.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
      })
      .expect({ statusCode: 200 });
  });
});
