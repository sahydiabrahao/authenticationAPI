import { AddAccountToDatabaseModel } from '@/application';
import { AddAccountParamsModel, AccountModel } from '@/domain';
import { MongoHelper } from './mongoHelper';

export class MongoDbAdapter implements AddAccountToDatabaseModel {
  async add(account: AddAccountParamsModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollections('accounts');

    const { insertedId } = await accountCollection.insertOne(account);
    const accountWithId: any = account;
    const { _id, ...accountWithout_id } = accountWithId;
    const newAccount = { ...accountWithout_id, id: insertedId.toString() };
    return newAccount;
  }
}
