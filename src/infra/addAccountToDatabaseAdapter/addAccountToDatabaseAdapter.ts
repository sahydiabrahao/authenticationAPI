import {
  AddAccountToDatabaseModel,
  LoadAccountByEmailModel,
  LoadAccountByEmailOutput,
} from '@application';
import { AddAccountInput, AddAccountOutput } from '@domain';
import { MongoHelper } from '../mongoHelper/mongoHelper';

export class AddAccountToDatabaseAdapter
  implements AddAccountToDatabaseModel, LoadAccountByEmailModel
{
  async add(account: AddAccountInput): Promise<AddAccountOutput> {
    const accountCollection = await MongoHelper.getCollections('accounts');
    const { insertedId } = await accountCollection.insertOne(account);
    const newAccount = { ...MongoHelper.map(account), id: insertedId.toString() };
    return newAccount;
  }

  async loadByEmail(email: string): Promise<LoadAccountByEmailOutput> {
    const accountCollection = await MongoHelper.getCollections('accounts');
    const accountInDatabase = await accountCollection.findOne({ email: email });
    if (!accountInDatabase) return null;
    const account = {
      ...MongoHelper.map(accountInDatabase),
      id: accountInDatabase?._id.toString(),
    };
    return account;
  }
}
