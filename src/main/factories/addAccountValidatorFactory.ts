import { RequiredFieldValidator, ValidatorComposite, ValidatorModel } from '@presentation';

export const AddAccountValidatorFactory = (): ValidatorModel => {
  const validators: ValidatorModel[] = [];
  const requiredFields = ['email', 'password', 'passwordConfirmation'];
  for (const field of requiredFields) validators.push(new RequiredFieldValidator(field));
  return new ValidatorComposite(validators);
};
