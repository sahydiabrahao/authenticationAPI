import { AuthenticateAccountModel } from '@domain';
import {
  ControllerModel,
  ControllerInput,
  ControllerOutput,
  ServerError,
  UnauthorizedError,
  ValidatorModel,
} from '@presentation';

export class AuthenticateAccountController implements ControllerModel {
  constructor(
    private readonly authenticateAccount: AuthenticateAccountModel,
    private readonly validator: ValidatorModel
  ) {}
  async handle(controllerInput: ControllerInput): Promise<ControllerOutput> {
    try {
      const validatorError = this.validator.validate(controllerInput.body);
      if (validatorError) return { statusCode: 400, body: validatorError };
      const { email, password } = controllerInput.body;
      const accessToken = await this.authenticateAccount.auth({ email, password });
      if (!accessToken) return { statusCode: 401, body: new UnauthorizedError() };
      return { statusCode: 200, body: { accessToken } };
    } catch (error) {
      return { statusCode: 500, body: new ServerError() };
    }
  }
}
