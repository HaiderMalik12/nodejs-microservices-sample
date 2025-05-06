import { Application, Request, Response } from 'express';
import v1 from '../v1/routes/index';

const BASEPATH = (process.env.BASEPATH as string) || '/';

export const appRoutes = (app: Application) => {
  app.get('/', (_: Request, res: Response) => {
    res.json({ msg: 'Welcome to logging service' });
  });
  app.get(BASEPATH, (_: Request, res: Response) => {
    res.json({ msg: 'Welcome to logging service' });
  });
  app.use('/' + 'v1', v1);
  app.use(BASEPATH + '/v1', v1);
};
