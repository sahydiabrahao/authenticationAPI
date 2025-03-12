import { AuthenticateAccountParamsModel, AuthenticatenModel } from '@domain';

export interface AuthenticateAccountModel {
  auth(account: AuthenticateAccountParamsModel): Promise<AuthenticatenModel>;
}
