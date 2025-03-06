import {
  ControllerModel,
  EmailValidatorModel,
  HttpRequestModel,
  HttpResponseModel,
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@/application';
import { AddAccountModel } from '@/domain';

export class AddAccountController implements ControllerModel {
  constructor(readonly emailValidator: EmailValidatorModel, readonly addAccount: AddAccountModel) {}

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
      const account = this.addAccount.add({ email, password });
      return { statusCode: 200, body: account };
    } catch (error) {
      return { statusCode: 500, body: new ServerError() };
    }
  }
}
