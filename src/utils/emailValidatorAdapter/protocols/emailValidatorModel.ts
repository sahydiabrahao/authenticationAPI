//TODO:make sync
export interface EmailValidatorModel {
  isValid(email: string): Promise<boolean>;
}
