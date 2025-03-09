import request from 'supertest';
import app from '@/main';

describe('ContentType Middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/contentTypeJson', (req, res) => {
      res.send('');
    });
    await request(app).get('/contentTypeJson').expect('content-type', /json/);
  });
  test('Should return xml content type when force', async () => {
    app.get('/contentTypeXml', (req, res) => {
      res.type('xml');
      res.send('');
    });
    await request(app).get('/contentTypeXml').expect('content-type', /xml/);
  });
});
