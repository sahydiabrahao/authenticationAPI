import { AuthenticateAccountInput, AuthenticateAccountOutput } from '@domain';

export interface AuthenticateAccountModel {
  auth(account: AuthenticateAccountInput): Promise<AuthenticateAccountOutput>;
}
