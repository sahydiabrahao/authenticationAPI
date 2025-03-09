import { clear } from 'console';
import { get } from 'http';
import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  mongoDbConnection: null as MongoClient | null,

  async connect(url: string) {
    this.mongoDbConnection = await MongoClient.connect(process.env.MONGO_URL || url);
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

  async clearCollection() {
    const collections = await MongoHelper.getConnection().db().collections();
    for (const collection of collections) {
      await collection.deleteMany({}); // Remove todos os documentos da coleção
    }
  },
};
