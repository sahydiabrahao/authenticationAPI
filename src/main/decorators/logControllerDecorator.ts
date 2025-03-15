import { AddLogErrorToDatabaseModel } from '@application';
import { ControllerModel, ControllerInput, ControllerOutput } from '@presentation';

export class LogControllerDecorator implements ControllerModel {
  constructor(
    private readonly controller: ControllerModel,
    private readonly addLogErrorToDatabase: AddLogErrorToDatabaseModel
  ) {}

  async handle(request: ControllerInput): Promise<ControllerOutput> {
    const controllerOutput = await this.controller.handle(request);
    if (controllerOutput.statusCode === 500) {
      await this.addLogErrorToDatabase.logError(controllerOutput.body.stack);
    }
    return controllerOutput;
  }
}
