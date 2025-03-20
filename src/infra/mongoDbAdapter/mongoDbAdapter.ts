import {
  AddAccountToDatabaseModel,
  LoadAccountByEmailModel,
  LoadAccountByEmailOutput,
  UpdateAccessTokenModel,
} from '@application';
import { AddAccountInput, AddAccountOutput } from '@domain';
import { MongoHelper } from '@infra';
import { ObjectId } from 'mongodb';

export class MongoDbAdapter
  implements AddAccountToDatabaseModel, LoadAccountByEmailModel, UpdateAccessTokenModel
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
  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollections('accounts');
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken: token } });
  }
}
