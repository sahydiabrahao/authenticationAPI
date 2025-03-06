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
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) return { statusCode: 400, body: new InvalidParamError('email') };
      return { statusCode: 200, body: 'Success' };
    } catch (error) {
      return { statusCode: 500, body: new ServerError() };
    }
  }
}
