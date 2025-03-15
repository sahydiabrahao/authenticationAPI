import {
  CompareFieldValidator,
  EmailValidator,
  RequiredFieldValidator,
  ValidatorComposite,
  ValidatorModel,
} from '@presentation';
import { EmailValidatorAdapter } from '@utils';

export const AddAccountValidatorFactory = (): ValidatorModel => {
  const validators: ValidatorModel[] = [];
  const requiredFields = ['email', 'password', 'passwordConfirmation'];
  for (const field of requiredFields) validators.push(new RequiredFieldValidator(field));
  validators.push(new CompareFieldValidator('password', 'passwordConfirmation'));
  validators.push(new EmailValidator('email', new EmailValidatorAdapter()));
  return new ValidatorComposite(validators);
};
