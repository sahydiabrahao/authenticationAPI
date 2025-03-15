import {
  ControllerModel,
  HttpRequestModel,
  HttpResponseModel,
  ServerError,
  ValidatorModel,
} from '@presentation';
import { AddAccountModel } from '@domain';

export class AddAccountController implements ControllerModel {
  constructor(
    private readonly addAccount: AddAccountModel,
    private readonly validator: ValidatorModel
  ) {}

  async handle(httpRequest: HttpRequestModel): Promise<HttpResponseModel> {
    try {
      const validatorError = await this.validator.validate(httpRequest.body);
      if (validatorError) return { statusCode: 400, body: validatorError };
      const { email, password } = httpRequest.body;
      const newAccount = await this.addAccount.add({ email, password });
      return { statusCode: 200, body: newAccount };
    } catch (error) {
      return { statusCode: 500, body: new ServerError() };
    }
  }
}
