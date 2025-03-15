import { ValidatorInput, ValidatorOutput } from '@presentation';

export interface ValidatorModel {
  validate(input: ValidatorInput): ValidatorOutput;
}
