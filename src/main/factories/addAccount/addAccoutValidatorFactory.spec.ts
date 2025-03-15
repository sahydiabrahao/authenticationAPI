import { AddAccountValidatorFactory } from './addAccountValidatorFactory';
import {
  CompareFieldValidator,
  EmailValidator,
  RequiredFieldValidator,
  ValidatorComposite,
  ValidatorModel,
} from '@presentation';
import { EmailValidatorModel } from '@utils';

const makeEmailValidatorStub = (): EmailValidatorModel => {
  class EmailValidatorStub implements EmailValidatorModel {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

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
    validators.push(new EmailValidator('email', makeEmailValidatorStub()));
    expect(ValidatorComposite).toHaveBeenCalledWith(validators);
  });
});
