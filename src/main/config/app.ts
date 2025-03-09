import express from 'express';
import { middlewares } from '@/main/config/middlewares';

const app = express();
middlewares(app);

export default app;
