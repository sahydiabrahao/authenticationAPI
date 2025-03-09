import { Express } from 'express';
import { bodyParser } from '../../main/middlewares/bodyParser/bodyParser';
import { cors } from '../../main/middlewares/cors/cors';
import { contentType } from '../../main/middlewares/contentType/contentType';

export const middlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};
