import { HttpRequestModel, HttpResponseModel } from '@/application';

export interface ControllerModel {
  handle: (httpRequest: HttpRequestModel) => Promise<HttpResponseModel>;
}
