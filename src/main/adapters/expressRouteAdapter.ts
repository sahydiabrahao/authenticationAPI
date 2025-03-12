import { ControllerModel, HttpRequestModel } from '@presentation';
import { Request, Response } from 'express';

export const expressRouteAdapter = (controller: ControllerModel) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequestModel = {
      body: req.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode === 500)
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
