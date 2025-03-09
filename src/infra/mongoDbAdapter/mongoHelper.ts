import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  mongoDbConnection: null as MongoClient | null,

  async connect(url: string) {
    this.mongoDbConnection = await MongoClient.connect(url);
  },

  async disconnect() {
    if (this.mongoDbConnection) {
      await this.mongoDbConnection.close();
      this.mongoDbConnection = null;
    }
  },

  getConnection() {
    if (!this.mongoDbConnection) {
      throw new Error('No MongoDB connection');
    }
    return this.mongoDbConnection;
  },

  getCollections(name: string): Collection {
    if (!this.mongoDbConnection) {
      throw new Error('No MongoDB connection');
    }
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
