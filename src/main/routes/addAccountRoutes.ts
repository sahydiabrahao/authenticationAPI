import { Router } from 'express';
import { addAccountControllerFactory } from '../factories/addAccountControllerFactory';
import { expressRouteAdapter } from '../adapters/expressRouteAdapter';

export default (router: Router): void => {
  router.post('/addAccount', expressRouteAdapter(addAccountControllerFactory()));
};
