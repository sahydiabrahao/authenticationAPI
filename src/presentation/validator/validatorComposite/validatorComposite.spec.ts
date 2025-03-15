import {
  MissingParamError,
  ValidatorComposite,
  ValidatorInput,
  ValidatorModel,
  ValidatorOutput,
} from '@presentation';

export class ValidatorStub implements ValidatorModel {
  validate(input: ValidatorInput): ValidatorOutput {
    return null;
  }
}

type SutTypes = {
  sut: ValidatorComposite;
  validatorStub: ValidatorModel;
};

const makeSut = (): SutTypes => {
  const validatorStub = new ValidatorStub();
  const sut = new ValidatorComposite([validatorStub]);
  return {
    sut,
    validatorStub,
  };
};

describe('ValidatorComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new MissingParamError('anyField'));
    const output = sut.validate({ anyField: 'anyValue' });
    expect(output).toEqual(new MissingParamError('anyField'));
  });
  test('Should return null if validation success', () => {
    const { sut } = makeSut();
    const output = sut.validate({ anyField: 'anyValue' });
    expect(output).toEqual(null);
  });
});
