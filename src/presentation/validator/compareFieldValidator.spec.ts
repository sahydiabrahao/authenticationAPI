import {
  CompareFieldValidator,
  InvalidParamError,
  MissingParamError,
  RequiredFieldValidator,
} from '@presentation';

type SutTypes = {
  sut: CompareFieldValidator;
};

const makeSut = (): SutTypes => {
  const sut = new CompareFieldValidator('anyField', 'anyFieldToCompare');
  return {
    sut,
  };
};

describe('CompareFieldValidator', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const { sut } = makeSut();
    const output = sut.validate({ anyField: 'anyValue', anyFieldToCompare: 'wrongValue' });
    expect(output).toEqual(new InvalidParamError('anyFieldToCompare'));
  });
  // test('Should return null if validation success', () => {
  //   const { sut } = makeSut();
  //   const output = sut.validate({ anyField: 'anyValue', anyFieldToCompare: 'anyValue' });
  //   expect(output).toEqual(null);
  // });
});
