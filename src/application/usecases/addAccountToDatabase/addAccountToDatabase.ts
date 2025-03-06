import { PasswordHasherModel } from '@/application';
import { AccountModel, AddAccountModel, AddAccountParamsModel } from '@/domain';

export class AddAccountToDatabase implements AddAccountModel {
  constructor(readonly passwordHasher: PasswordHasherModel) {}
  async add(account: AddAccountParamsModel): Promise<AccountModel> {
    this.passwordHasher.hash(account.password);

    return Promise.resolve({ ...account, id: 'validId' });
  }
}
