export type LoadAccountByEmailOutput = {
  id: string;
  email: string;
  password: string;
} | null;

export interface LoadAccountByEmailInput {
  email: string;
}

export interface LoadAccountByEmailModel {
  load(email: LoadAccountByEmailInput): Promise<LoadAccountByEmailOutput>;
}
