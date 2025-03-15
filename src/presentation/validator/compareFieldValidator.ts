import { InvalidParamError, ValidatorInput, ValidatorModel, ValidatorOutput } from '@presentation';

export class CompareFieldValidator implements ValidatorModel {
  constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) {}
  validate(input: ValidatorInput): ValidatorOutput {
    if (input[this.fieldName] !== input[this.fieldToCompareName])
      return new InvalidParamError(this.fieldToCompareName);
    return null;
  }
}
