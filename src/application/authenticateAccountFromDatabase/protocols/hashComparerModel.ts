export interface HashComparerModel {
  compare(value: string, hash: string): Promise<boolean>;
}
