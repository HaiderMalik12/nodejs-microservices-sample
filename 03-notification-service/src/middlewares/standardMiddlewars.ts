import express, { Application } from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';


export const standardMiddlewares = (app: Application) => {
  app.use(cors());
  app.use((_, res, next) => {
    res.append('Access-Control-Expose-Headers', 'x-total, x-total-pages');
    next();
  });

  app.use(logger('dev'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
};
