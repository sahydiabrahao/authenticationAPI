import { EmailValidatorModel } from '@utils';
import validator from 'validator';

export class EmailValidatorAdapter implements EmailValidatorModel {
  async isValid(email: string): Promise<boolean> {
    if (!validator.isEmail(email)) {
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }
}
