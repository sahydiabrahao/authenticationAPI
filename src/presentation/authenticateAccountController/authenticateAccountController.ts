import {
  ControllerModel,
  HttpRequestModel,
  HttpResponseModel,
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@presentation';
import { EmailValidatorModel } from '@utils';

export class AuthenticateAccountController implements ControllerModel {
  constructor(private readonly emailValidator: EmailValidatorModel) {}
  async handle(httpRequest: HttpRequestModel): Promise<HttpResponseModel> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) return { statusCode: 400, body: new MissingParamError('email') };
      if (!password) return { statusCode: 400, body: new MissingParamError('password') };
      const isValid = await this.emailValidator.isValid(email);
      if (!isValid) return { statusCode: 400, body: new InvalidParamError('email') };
      return { statusCode: 200, body: 'anyBody' };
    } catch (error) {
      return { statusCode: 500, body: new ServerError() };
    }
  }
}
