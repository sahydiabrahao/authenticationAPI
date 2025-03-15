import { AddAccountToDatabaseModel } from '@application';
import { AddAccountInput, AddAccountOutput } from '@domain';
import { MongoHelper } from '../mongoHelper/mongoHelper';

export class AddAccountToDatabaseAdapter implements AddAccountToDatabaseModel {
  async add(account: AddAccountInput): Promise<AddAccountOutput> {
    const accountCollection = await MongoHelper.getCollections('accounts');
    const { insertedId } = await accountCollection.insertOne(account);
    const newAccount = { ...MongoHelper.map(account), id: insertedId.toString() };
    return newAccount;
  }
}
