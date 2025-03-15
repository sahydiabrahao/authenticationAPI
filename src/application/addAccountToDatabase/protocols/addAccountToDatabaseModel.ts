import { AddAccountOutput, AddAccountInput } from '@domain';

export interface AddAccountToDatabaseModel {
  add(account: AddAccountInput): Promise<AddAccountOutput>;
}
