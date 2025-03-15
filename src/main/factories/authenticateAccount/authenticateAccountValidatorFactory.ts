import {
  EmailValidator,
  RequiredFieldValidator,
  ValidatorComposite,
  ValidatorModel,
} from '@presentation';
import { EmailValidatorAdapter } from '@utils';

export const AuthenticateAccountValidatorFactory = (): ValidatorModel => {
  const validators: ValidatorModel[] = [];
  const requiredFields = ['email', 'password'];
  for (const field of requiredFields) validators.push(new RequiredFieldValidator(field));
  validators.push(new EmailValidator('email', new EmailValidatorAdapter()));
  return new ValidatorComposite(validators);
};
