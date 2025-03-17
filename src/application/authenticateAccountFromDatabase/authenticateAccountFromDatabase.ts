import {
  AuthenticateAccountInput,
  AuthenticateAccountModel,
  AuthenticateAccountOutput,
} from '@domain';
import { LoadAccountByEmailModel } from './protocols/LoadAccountByEmailModel';

export class AuthenticateAccountFromDatabase implements AuthenticateAccountModel {
  constructor(private readonly loadAccountByEmail: LoadAccountByEmailModel) {}
  async auth(account: AuthenticateAccountInput): Promise<AuthenticateAccountOutput> {
    await this.loadAccountByEmail.load({ email: account.email });
    return null;
  }
}
