import { AuthenticationAccountParamsModel } from '@domain';

export interface AuthenticationAccountModel {
  auth(account: AuthenticationAccountParamsModel): Promise<string>;
}
