import {
  AuthenticateAccountInput,
  AuthenticateAccountModel,
  AuthenticateAccountOutput,
} from '@domain';
import { LoadAccountByEmailModel } from './protocols/loadAccountByEmailModel';
import { HashComparerModel } from './protocols/hashComparerModel';

export class AuthenticateAccountFromDatabase implements AuthenticateAccountModel {
  constructor(
    private readonly loadAccountByEmail: LoadAccountByEmailModel,
    private readonly hashComparer: HashComparerModel
  ) {}
  async auth(authenticateAccount: AuthenticateAccountInput): Promise<AuthenticateAccountOutput> {
    const databaseAccount = await this.loadAccountByEmail.load({
      email: authenticateAccount.email,
    });
    if (databaseAccount)
      await this.hashComparer.compare({
        value: authenticateAccount.password,
        hash: databaseAccount.password,
      });
    return null;
  }
}
