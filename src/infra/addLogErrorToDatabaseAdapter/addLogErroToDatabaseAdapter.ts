import { AddLogErrorToDatabaseModel } from '@application';
import { MongoHelper } from '../mongoHelper/mongoHelper';

export class AddLogErroToDatabaseAdapter implements AddLogErrorToDatabaseModel {
  async logError(error: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollections('errors');
    errorCollection.insertOne({
      stack: error,
      data: new Date(),
    });
  }
}
