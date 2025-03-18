export interface TokenGeneratorModel {
  generate(value: string): Promise<string>;
}
