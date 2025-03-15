import { AuthenticateAccountParamsModel, AuthenticateModel } from '@domain';

export interface AuthenticateAccountModel {
  auth(account: AuthenticateAccountParamsModel): Promise<AuthenticateModel>;
}
