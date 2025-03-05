import {
  ControllerModel,
  HttpRequestModel,
  HttpResponseModel,
  MissingParamError,
} from '@/application';

export class AddAccountController implements ControllerModel {
  handle(httpRequest: HttpRequestModel): HttpResponseModel {
    const requiredFields = ['email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return { statusCode: 400, body: new MissingParamError(field) };
      }
    }
    return { statusCode: 200, body: 'Success' };
  }
}
