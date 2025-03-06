import {
  ControllerModel,
  EmailValidatorModel,
  HttpRequestModel,
  HttpResponseModel,
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@/application';

export class AddAccountController implements ControllerModel {
  constructor(readonly emailValidator: EmailValidatorModel) {}

  handle(httpRequest: HttpRequestModel): HttpResponseModel {
    try {
      const requiredFields = ['email', 'password', 'passwordConfirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return { statusCode: 400, body: new MissingParamError(field) };
      }
      const { email, password, passwordConfirmation } = httpRequest.body;
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) return { statusCode: 400, body: new InvalidParamError('email') };
      if (password !== passwordConfirmation)
        return { statusCode: 400, body: new InvalidParamError('passwordConfirmation') };
      return { statusCode: 200, body: 'Success' };
    } catch (error) {
      return { statusCode: 500, body: new ServerError() };
    }
  }
}
