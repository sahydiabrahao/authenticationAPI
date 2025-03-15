import { AddAccountOutput, AddAccountInput } from '@domain';

export interface AddAccountModel {
  add(account: AddAccountInput): Promise<AddAccountOutput>;
}
