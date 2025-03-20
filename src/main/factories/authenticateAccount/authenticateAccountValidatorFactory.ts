import {
  EmailValidator,
  RequiredFieldValidator,
  ValidatorComposite,
  ValidatorModel,
} from '@presentation';
import { ValidatorAdapter } from '@utils';

export const AuthenticateAccountValidatorFactory = (): ValidatorModel => {
  const validators: ValidatorModel[] = [];
  const requiredFields = ['email', 'password'];
  for (const field of requiredFields) validators.push(new RequiredFieldValidator(field));
  validators.push(new EmailValidator('email', new ValidatorAdapter()));
  return new ValidatorComposite(validators);
};
