import { HttpRequestModel, HttpResponseModel, MissingParamError } from '@/application';

export class SignUpController {
  handle(httpRequest: HttpRequestModel): HttpResponseModel {
    if (!httpRequest.body.email) return { statusCode: 400, body: new MissingParamError('email') };
    if (!httpRequest.body.password)
      return { statusCode: 400, body: new MissingParamError('password') };
    if (!httpRequest.body.passwordConfirmation)
      return { statusCode: 400, body: new MissingParamError('password confirmation') };
    return { statusCode: 200, body: 'Success' };
  }
}
