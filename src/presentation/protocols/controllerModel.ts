import { ControllerInput, ControllerOutput } from '@presentation';

export interface ControllerModel {
  handle: (controllerInput: ControllerInput) => Promise<ControllerOutput>;
}
