import express from 'express';
import { middlewares, routes } from '@main';

const app = express();
middlewares(app);
routes(app);
export default app;
