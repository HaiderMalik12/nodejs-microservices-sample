import express, { Router } from 'express';
import { RiderCoordiantesLog } from '../controllers/riderCoordinates';
import { authenticate } from '@logs/middlewares/authMiddleware';
import expressAsyncHandler from 'express-async-handler';

class RiderCoordinatesRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      '/',
      expressAsyncHandler((req, res) => {
        RiderCoordiantesLog.create(req, res);
      })
    );
    this.router.get(
      '/',
      authenticate,
      expressAsyncHandler((req, res) => {
        RiderCoordiantesLog.findRiderCoordinates(req, res);
      })
    );
    this.router.get(
      '/all',
      authenticate,
      expressAsyncHandler((req, res) => {
        RiderCoordiantesLog.findAllRidersCoordinates(req, res);
      })
    );
    this.router.get(
      '/export',
      authenticate,
      expressAsyncHandler((req, res) => {
        RiderCoordiantesLog.exportCoordinates(req, res);
      })
    );

    return this.router;
  }
}

export const riderCoordinatesRoutes: RiderCoordinatesRoutes = new RiderCoordinatesRoutes();
