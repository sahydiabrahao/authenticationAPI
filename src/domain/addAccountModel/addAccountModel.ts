import { AccountModel, AddAccountParamsModel } from '@domain';

export interface AddAccountModel {
  add(account: AddAccountParamsModel): Promise<AccountModel>;
}
