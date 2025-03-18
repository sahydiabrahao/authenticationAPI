import { TokenGeneratorModel } from '@application';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements TokenGeneratorModel {
  constructor(private readonly SECRET_KEY: string) {}

  async generate(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.SECRET_KEY);
    return accessToken;
  }
}
