import { AddAccountToDatabaseModel, PasswordHasherModel } from '@/application';
import { AccountModel, AddAccountModel, AddAccountParamsModel } from '@/domain';

export class AddAccountToDatabase implements AddAccountModel {
  constructor(
    private readonly passwordHasher: PasswordHasherModel,
    private readonly addAccountToDatabase: AddAccountToDatabaseModel
  ) {}
  async add(account: AddAccountParamsModel): Promise<AccountModel> {
    const hashedPassword = await this.passwordHasher.hash(account.password);
    const accountWithHashedPassword = { ...account, password: hashedPassword };
    const newAccount = await this.addAccountToDatabase.add(accountWithHashedPassword);
    return newAccount;
  }
}
