import { MongoHelper } from '@infra';
//TODO:remove 'mongodb://127.0.0.1:27017/authenticationAPI' and 5050
MongoHelper.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/authenticationAPI')
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(process.env.PORT || 5050, () =>
      console.log(`Server is running on http://localhost:${process.env.PORT || 5050}`)
    );
  })
  .catch(console.error);
