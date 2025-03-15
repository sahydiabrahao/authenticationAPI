import { MissingParamError, ValidatorInput, ValidatorModel, ValidatorOutput } from '@presentation';

export class RequiredFieldValidator implements ValidatorModel {
  constructor(private readonly fieldName: string) {}
  validate(input: ValidatorInput): ValidatorOutput {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName);
    return null;
  }
}
