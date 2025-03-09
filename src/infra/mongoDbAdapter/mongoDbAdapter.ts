import { AddAccountToDatabaseModel } from '@/application';
import { AddAccountParamsModel, AccountModel } from '@/domain';
import { MongoHelper } from './mongoHelper';

export class MongoDbAdapter implements AddAccountToDatabaseModel {
  async add(account: AddAccountParamsModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollections('accounts');
    const { insertedId } = await accountCollection.insertOne(account);
    const newAccount = { ...MongoHelper.map(account), id: insertedId.toString() };
    return newAccount;
  }
}
