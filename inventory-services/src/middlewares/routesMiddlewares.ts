import { Application, Request, Response } from 'express';
import v1 from '../v1/routes/index';

export const appRoutes = (app: Application) => {
  app.get('/', (_: Request, res: Response) => {
    res.json({ msg: 'Welcome to orders service' });
  });
  app.use('/' + 'v1', v1);
};
