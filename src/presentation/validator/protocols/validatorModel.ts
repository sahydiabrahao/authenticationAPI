import { ValidatorInput, ValidatorOutput } from '@presentation';

export interface ValidatorModel {
  validate(account: ValidatorInput): ValidatorOutput;
}
