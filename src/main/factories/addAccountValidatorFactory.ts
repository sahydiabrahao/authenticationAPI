import {
  CompareFieldValidator,
  RequiredFieldValidator,
  ValidatorComposite,
  ValidatorModel,
} from '@presentation';

export const AddAccountValidatorFactory = (): ValidatorModel => {
  const validators: ValidatorModel[] = [];
  const requiredFields = ['email', 'password', 'passwordConfirmation'];
  for (const field of requiredFields) validators.push(new RequiredFieldValidator(field));
  validators.push(new CompareFieldValidator('password', 'passwordConfirmation'));
  return new ValidatorComposite(validators);
};
