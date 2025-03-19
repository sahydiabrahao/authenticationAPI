import { Router } from 'express';
import { AuthenticateAccountControllerFactory, expressRouteAdapter } from '@main';

export default (router: Router): void => {
  router.post('/authenticateAccount', expressRouteAdapter(AuthenticateAccountControllerFactory()));
};
