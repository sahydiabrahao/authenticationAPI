import { MongoHelper } from '@infra';

MongoHelper.connect(process.env.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(console.error);
