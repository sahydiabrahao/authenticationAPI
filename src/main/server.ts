import { MongoHelper } from '@infra';
import { env } from '../main/config/env';

MongoHelper.connect(env.mongoURL)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(process.env.PORT || 5050, () =>
      console.log(`Server is running on http://localhost:${env.port}`)
    );
  })
  .catch(console.error);
