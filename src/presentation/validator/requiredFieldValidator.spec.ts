import { MissingParamError, RequiredFieldValidator } from '@presentation';

type SutTypes = {
  sut: RequiredFieldValidator;
};

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidator('anyField');
  return {
    sut,
  };
};

describe('RequiredFieldValidator', () => {
  test('Should return MissingParamError if validation fails', () => {
    const { sut } = makeSut();
    const output = sut.validate({ anotherField: 'anotherField' });
    expect(output).toEqual(new MissingParamError('anyField'));
  });
});
