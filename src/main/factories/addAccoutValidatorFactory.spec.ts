import { AddAccountValidatorFactory } from './addAccountValidatorFactory';
import {
  CompareFieldValidator,
  RequiredFieldValidator,
  ValidatorComposite,
  ValidatorModel,
} from '@presentation';

jest.mock('@presentation/validators/validatorComposite', () => {
  const actual = jest.requireActual('@presentation/validators/validatorComposite');
  return {
    ...actual,
    ValidatorComposite: jest.fn().mockImplementation(() => ({
      validate: jest.fn(),
    })),
  };
});
describe('AddAccountValidatorFactory', () => {
  test('Should call ValidatorComposite with all validators', () => {
    AddAccountValidatorFactory();
    const validators: ValidatorModel[] = [];
    const requiredFields = ['email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) validators.push(new RequiredFieldValidator(field));
    validators.push(new CompareFieldValidator('password', 'passwordConfirmation'));
    expect(ValidatorComposite).toHaveBeenCalledWith(validators);
  });
});
