import { ValidatorInput, ValidatorModel, ValidatorOutput } from '@presentation';

export class ValidatorComposite implements ValidatorModel {
  constructor(private readonly validators: ValidatorModel[]) {}
  validate(input: ValidatorInput): ValidatorOutput {
    for (const validator of this.validators) {
      const validatorError = validator.validate(input);
      if (validatorError) return validatorError;
    }
    return null;
  }
}
