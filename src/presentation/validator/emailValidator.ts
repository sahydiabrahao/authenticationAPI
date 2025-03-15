import { InvalidParamError, ValidatorInput, ValidatorModel, ValidatorOutput } from '@presentation';
import { EmailValidatorModel } from '@utils';

export class EmailValidator implements ValidatorModel {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidatorModel
  ) {}
  validate(input: ValidatorInput): ValidatorOutput {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) return new InvalidParamError(this.fieldName);
    return null;
  }
}
