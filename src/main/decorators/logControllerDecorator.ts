import { ControllerModel, HttpRequestModel, HttpResponseModel } from '@presentation';
// import { LogErrorRepository } from '@infra';

export class LogControllerDecorator implements ControllerModel {
  constructor(
    private readonly controller: ControllerModel // private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(request: HttpRequestModel): Promise<HttpResponseModel> {
    const httpResponse = await this.controller.handle(request);
    if (httpResponse.statusCode === 500) {
      // await this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
