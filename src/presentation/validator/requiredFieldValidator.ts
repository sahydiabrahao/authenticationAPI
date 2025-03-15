import { MissingParamError, ValidatorInput, ValidatorModel, ValidatorOutput } from '@presentation';

export class RequiredFieldValidator implements ValidatorModel {
  constructor(private readonly fieldName: string) {}
  async validate(input: ValidatorInput): ValidatorOutput {
    if (!input[this.fieldName]) return Promise.resolve(new MissingParamError(this.fieldName));
    return Promise.resolve(null);
  }
}
