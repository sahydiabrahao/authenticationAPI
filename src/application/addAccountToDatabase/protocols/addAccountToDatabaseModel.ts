import { AccountModel, AddAccountParamsModel } from '@/domain';

export interface AddAccountToDatabaseModel {
  add(account: AddAccountParamsModel): Promise<AccountModel>;
}
