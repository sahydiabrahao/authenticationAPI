import { EmailValidatorModel } from '@/application';

export class EmailValidatorAdapter implements EmailValidatorModel {
  async isValid(email: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
