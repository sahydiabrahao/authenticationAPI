import { MongoHelper } from '@infra';
import env from './config/env';

MongoHelper.connect(env.mongoURL)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () => console.log(`Server is running on http://localhost:${env.port}`));
  })
  .catch(console.error);
