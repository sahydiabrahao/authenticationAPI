import {
  AuthenticateAccountInput,
  AuthenticateAccountModel,
  AuthenticateAccountOutput,
} from '@domain';
import {
  LoadAccountByEmailModel,
  HashComparerModel,
  TokenGeneratorModel,
  UpdateAccessTokenModel,
} from '@application';

export class AuthenticateAccountFromDatabase implements AuthenticateAccountModel {
  constructor(
    private readonly loadAccountByEmail: LoadAccountByEmailModel,
    private readonly hashComparer: HashComparerModel,
    private readonly tokenGenerator: TokenGeneratorModel,
    private readonly updateAccessToken: UpdateAccessTokenModel
  ) {}
  async auth(authenticateAccount: AuthenticateAccountInput): Promise<AuthenticateAccountOutput> {
    const databaseAccount = await this.loadAccountByEmail.loadByEmail(authenticateAccount.email);
    if (!databaseAccount) return null;
    const isValid = await this.hashComparer.compare(
      authenticateAccount.password,
      databaseAccount.password
    );
    if (!isValid) return null;
    const accessToken = await this.tokenGenerator.generate(databaseAccount.id);
    await this.updateAccessToken.updateAccessToken(databaseAccount.id, accessToken);
    return accessToken;
  }
}
