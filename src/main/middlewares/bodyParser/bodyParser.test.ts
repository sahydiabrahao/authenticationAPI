import request from 'supertest';
import app from '@/main';
describe('BodyParser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/testBodyParser', (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post('/testBodyParser')
      .send({ name: 'anyName' })
      .expect({ name: 'anyName' });
  });
});
