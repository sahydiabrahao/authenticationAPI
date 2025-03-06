export interface EmailValidatorModel {
  isValid(email: string): Promise<boolean>;
}
