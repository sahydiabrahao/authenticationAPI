import { LoadAccountByEmailInput, LoadAccountByEmailOutput } from '@application';

export interface LoadAccountByEmailModel {
  load(email: LoadAccountByEmailInput): Promise<LoadAccountByEmailOutput>;
}
