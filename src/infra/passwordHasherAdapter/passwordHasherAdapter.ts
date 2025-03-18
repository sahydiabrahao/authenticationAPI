import { HashComparerModel, PasswordHasherModel } from '@application';
import bcrypt from 'bcrypt';

export class PasswordHasherAdapter implements PasswordHasherModel, HashComparerModel {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = bcrypt.compare(value, hash);
    if (!isValid) return false;
    return isValid;
  }
}
