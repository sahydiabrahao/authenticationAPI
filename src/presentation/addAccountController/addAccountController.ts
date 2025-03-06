import {
  ControllerModel,
  HttpRequestModel,
  HttpResponseModel,
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@/presentation';
import { EmailValidatorModel } from '@/utils';
import { AddAccountModel } from '@/domain';

export class AddAccountController implements ControllerModel {
  constructor(readonly emailValidator: EmailValidatorModel, readonly addAccount: AddAccountModel) {}

  async handle(httpRequest: HttpRequestModel): Promise<HttpResponseModel> {
    try {
      const requiredFields = ['email', 'password', 'passwordConfirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return { statusCode: 400, body: new MissingParamError(field) };
      }
      const { email, password, passwordConfirmation } = httpRequest.body;
      const isValid = await this.emailValidator.isValid(email);
      if (!isValid) return { statusCode: 400, body: new InvalidParamError('email') };
      if (password !== passwordConfirmation)
        return { statusCode: 400, body: new InvalidParamError('passwordConfirmation') };
      const account = await this.addAccount.add({ email, password });
      return { statusCode: 200, body: account };
    } catch (error) {
      return { statusCode: 500, body: new ServerError() };
    }
  }
}
