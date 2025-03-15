import { ControllerModel } from '@presentation';
import { Request, Response } from 'express';

export const expressRouteAdapter = (controller: ControllerModel) => {
  return async (req: Request, res: Response) => {
    const httpResponse = await controller.handle(req);
    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
    }
  };
};
