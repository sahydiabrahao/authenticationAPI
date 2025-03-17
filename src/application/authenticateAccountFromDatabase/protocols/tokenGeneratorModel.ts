export interface TokenGeneratorModel {
  generate(id: string): Promise<string>;
}
