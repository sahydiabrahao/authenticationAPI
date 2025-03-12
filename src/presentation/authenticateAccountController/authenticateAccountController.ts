import {
  ControllerModel,
  HttpRequestModel,
  HttpResponseModel,
  MissingParamError,
} from '@presentation';
import { EmailValidatorModel } from '@utils';

export class AuthenticateAccountController implements ControllerModel {
  constructor(private readonly emailValidator: EmailValidatorModel) {}
  async handle(httpRequest: HttpRequestModel): Promise<HttpResponseModel> {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return { statusCode: 400, body: new MissingParamError(field) };
    }
    const { email } = httpRequest.body;
    this.emailValidator.isValid(email);
    return { statusCode: 200, body: 'anyBody' };
  }
}
