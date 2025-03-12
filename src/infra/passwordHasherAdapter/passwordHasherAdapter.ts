import { PasswordHasherModel } from '@application';
import bcrypt from 'bcrypt';

export class PasswordHasherAdapter implements PasswordHasherModel {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }
}
