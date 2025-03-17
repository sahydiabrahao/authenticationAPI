export type LoadAccountByEmailOutput = {
  id: string;
  email: string;
  password: string;
} | null;

export interface LoadAccountByEmailModel {
  load(email: string): Promise<LoadAccountByEmailOutput>;
}
