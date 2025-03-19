import { Collection, MongoClient } from 'mongodb';
import { env } from '../../main/config/env';

export const MongoHelper = {
  mongoDbConnection: null as MongoClient | null,
  url: env.mongoURL,

  async connect(url: string) {
    url = this.url;
    this.mongoDbConnection = await MongoClient.connect(url);
  },

  async disconnect() {
    if (this.mongoDbConnection) {
      await this.mongoDbConnection.close();
      this.mongoDbConnection = null;
    }
  },

  getConnection() {
    if (!this.mongoDbConnection) throw new Error('No MongoDB connection');
    return this.mongoDbConnection;
  },

  async getCollections(name: string): Promise<Collection> {
    if (!this.mongoDbConnection) await this.connect(this.url);
    if (!this.mongoDbConnection) throw new Error('MongoDB connection failed.');
    return this.mongoDbConnection.db().collection(name);
  },

  async clearAllCollection() {
    const collections = await MongoHelper.getConnection().db().collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  },

  map: (collection: any): any => {
    const collectionWith_Id: any = collection;
    const { _id, ...collectionWithout_id } = collectionWith_Id;
    return collectionWithout_id;
  },
};
