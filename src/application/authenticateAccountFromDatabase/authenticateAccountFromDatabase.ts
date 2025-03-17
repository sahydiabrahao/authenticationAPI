import {
  AuthenticateAccountInput,
  AuthenticateAccountModel,
  AuthenticateAccountOutput,
} from '@domain';
import { LoadAccountByEmailModel } from './protocols/loadAccountByEmailModel';
import { HashComparerModel } from './protocols/hashComparerModel';
import { TokenGeneratorModel } from './protocols/tokenGeneratorModel';

export class AuthenticateAccountFromDatabase implements AuthenticateAccountModel {
  constructor(
    private readonly loadAccountByEmail: LoadAccountByEmailModel,
    private readonly hashComparer: HashComparerModel,
    private readonly tokenGenerator: TokenGeneratorModel
  ) {}
  async auth(authenticateAccount: AuthenticateAccountInput): Promise<AuthenticateAccountOutput> {
    const databaseAccount = await this.loadAccountByEmail.load(authenticateAccount.email);
    if (!databaseAccount) return null;
    const isValid = await this.hashComparer.compare(
      authenticateAccount.password,
      databaseAccount.password
    );
    if (!isValid) return null;
    return await this.tokenGenerator.generate(databaseAccount.id);
  }
}
