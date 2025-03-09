import { Router } from 'express';
import { addAccountControllerFactory, expressRouteAdapter } from '@main';

export default (router: Router): void => {
  router.post('/addAccount', expressRouteAdapter(addAccountControllerFactory()));
};
