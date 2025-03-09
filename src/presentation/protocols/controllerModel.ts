import { HttpRequestModel, HttpResponseModel } from '@presentation';

export interface ControllerModel {
  handle: (httpRequest: HttpRequestModel) => Promise<HttpResponseModel>;
}
