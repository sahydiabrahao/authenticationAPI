import { AddLogErrorToDatabaseModel } from '@application';
import { ControllerModel, HttpRequestModel, HttpResponseModel } from '@presentation';

export class LogControllerDecorator implements ControllerModel {
  constructor(
    private readonly controller: ControllerModel,
    private readonly addLogErrorToDatabase: AddLogErrorToDatabaseModel
  ) {}

  async handle(request: HttpRequestModel): Promise<HttpResponseModel> {
    const httpResponse = await this.controller.handle(request);
    if (httpResponse.statusCode === 500) {
      await this.addLogErrorToDatabase.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
