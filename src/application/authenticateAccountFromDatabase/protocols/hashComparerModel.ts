export interface HashComparerInput {
  value: string;
  hash: string;
}

export interface HashComparerModel {
  compare(passwords: HashComparerInput): Promise<boolean>;
}
