import { ControllerModel } from '@presentation';
import { Request, Response } from 'express';

export const expressRouteAdapter = (controller: ControllerModel) => {
  return async (req: Request, res: Response) => {
    const controllerOutput = await controller.handle(req);
    if (controllerOutput.statusCode === 200) {
      res.status(200).json(controllerOutput.body);
    } else {
      res.status(controllerOutput.statusCode).json({ error: controllerOutput.body.message });
    }
  };
};
