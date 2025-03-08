import { AddAccountToDatabaseModel, PasswordHasherModel } from '@/application';
import { AccountModel, AddAccountModel, AddAccountParamsModel } from '@/domain';

export class AddAccountToDatabase implements AddAccountModel {
  constructor(
    readonly passwordHasher: PasswordHasherModel,
    readonly addAccountToDatabaseAdapter: AddAccountToDatabaseModel
  ) {}
  async add(account: AddAccountParamsModel): Promise<AccountModel> {
    const hashedPassword = await this.passwordHasher.hash(account.password);
    const accountWithHashedPassword = { ...account, password: hashedPassword };
    await this.addAccountToDatabaseAdapter.add(accountWithHashedPassword);
    return Promise.resolve({ ...account, id: 'validId' });
  }
}
