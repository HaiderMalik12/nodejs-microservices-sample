import express, { Application } from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path'

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

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
  app.use("/order-services/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
