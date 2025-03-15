import { AddAccountToDatabaseModel, PasswordHasherModel } from '@application';
import { AddAccountOutput, AddAccountModel, AddAccountInput } from '@domain';

export class AddAccountToDatabase implements AddAccountModel {
  constructor(
    private readonly passwordHasher: PasswordHasherModel,
    private readonly addAccountToDatabase: AddAccountToDatabaseModel
  ) {}
  async add(account: AddAccountInput): Promise<AddAccountOutput> {
    const hashedPassword = await this.passwordHasher.hash(account.password);
    const accountWithHashedPassword = { ...account, password: hashedPassword };
    const newAccount = await this.addAccountToDatabase.add(accountWithHashedPassword);
    return newAccount;
  }
}
