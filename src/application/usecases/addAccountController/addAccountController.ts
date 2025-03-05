import {
  ControllerModel,
  EmailValidatorModel,
  HttpRequestModel,
  HttpResponseModel,
  InvalidParamError,
  MissingParamError,
} from '@/application';

export class AddAccountController implements ControllerModel {
  constructor(readonly emailValidator: EmailValidatorModel) {}

  handle(httpRequest: HttpRequestModel): HttpResponseModel {
    const requiredFields = ['email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return { statusCode: 400, body: new MissingParamError(field) };
      }
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email);
    if (!isValid) return { statusCode: 400, body: new InvalidParamError('email') };
    return { statusCode: 200, body: 'Success' };
  }
}
