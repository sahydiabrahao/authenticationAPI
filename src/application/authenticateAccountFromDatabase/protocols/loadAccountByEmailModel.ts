export type LoadAccountByEmailOutput = {
  id: string;
  email: string;
  password: string;
} | null;
export interface LoadAccountByEmailModel {
  loadByEmail(email: string): Promise<LoadAccountByEmailOutput>;
}
