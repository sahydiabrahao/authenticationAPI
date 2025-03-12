import { AuthenticationAccountParamsModel, AuthenticationModel } from '@domain';

export interface AuthenticationAccountModel {
  auth(account: AuthenticationAccountParamsModel): Promise<AuthenticationModel>;
}
