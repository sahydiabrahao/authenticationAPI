import {
  ControllerModel,
  HttpRequestModel,
  HttpResponseModel,
  MissingParamError,
} from '@presentation';

export class AuthenticateAccountController implements ControllerModel {
  async handle(httpRequest: HttpRequestModel): Promise<HttpResponseModel> {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return { statusCode: 400, body: new MissingParamError(field) };
    }
    return { statusCode: 200, body: 'anyBody' };
  }
}
