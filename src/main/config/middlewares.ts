import { Express } from 'express';
import { bodyParser } from '@/main/middlewares/bodyParser';
import { cors } from '@/main/middlewares/cors';

export const middlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
};
