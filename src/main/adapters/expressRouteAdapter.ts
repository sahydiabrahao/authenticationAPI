import { ControllerModel, HttpRequestModel } from '@/presentation';
import { Request, Response } from 'express';

export const expressRouteAdapter = (controller: ControllerModel) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequestModel = {
      body: req.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
