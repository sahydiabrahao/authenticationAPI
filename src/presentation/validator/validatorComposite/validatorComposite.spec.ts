import {
  InvalidParamError,
  MissingParamError,
  ValidatorComposite,
  ValidatorInput,
  ValidatorModel,
  ValidatorOutput,
} from '@presentation';

const makeValidatorStub = (): ValidatorModel => {
  class ValidatorStub implements ValidatorModel {
    validate(input: ValidatorInput): ValidatorOutput {
      return null;
    }
  }
  return new ValidatorStub();
};

type SutTypes = {
  sut: ValidatorComposite;
  validatorStub: ValidatorModel[];
};

const makeSut = (): SutTypes => {
  const validatorStub = [makeValidatorStub(), makeValidatorStub()];
  const sut = new ValidatorComposite(validatorStub);
  return {
    sut,
    validatorStub,
  };
};

describe('ValidatorComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub[0], 'validate').mockReturnValueOnce(new MissingParamError('anyField'));
    const output = sut.validate({ anyField: 'anyValue' });
    expect(output).toEqual(new MissingParamError('anyField'));
  });
  test('Should return the first error if more than one validation fails', () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub[0], 'validate').mockReturnValueOnce(new InvalidParamError('anyField'));
    jest.spyOn(validatorStub[1], 'validate').mockReturnValueOnce(new MissingParamError('anyField'));
    const output = sut.validate({ anyField: 'anyValue' });
    expect(output).toEqual(new InvalidParamError('anyField'));
  });
  test('Should return null if validation success', () => {
    const { sut } = makeSut();
    const output = sut.validate({ anyField: 'anyValue' });
    expect(output).toEqual(null);
  });
});
