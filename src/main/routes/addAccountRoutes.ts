import { Router } from 'express';

export default (router: Router): void => {
  router.post('/addAccount', (req, res) => {
    res.json({ statusCode: 200 });
  });
};
