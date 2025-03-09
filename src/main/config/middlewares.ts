import { Express } from 'express';
import { bodyParser } from '@/main/middlewares/bodyParser';

export const middlewares = (app: Express): void => {
  app.use(bodyParser);
};
