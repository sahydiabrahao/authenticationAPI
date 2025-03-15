import { EmailValidatorModel } from '@utils';
import validator from 'validator';

export class EmailValidatorAdapter implements EmailValidatorModel {
  isValid(email: string): boolean {
    if (!validator.isEmail(email)) {
      return false;
    }
    return true;
  }
}
