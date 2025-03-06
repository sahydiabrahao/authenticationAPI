export interface PasswordHasherModel {
  hash(password: string): Promise<string>;
}
