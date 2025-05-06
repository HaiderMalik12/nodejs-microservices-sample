import express, { Router } from 'express';
import { authenticate } from '@logs/middlewares/authMiddleware';
import expressAsyncHandler from 'express-async-handler';
import { RiderBookingCoordinatesLog } from '../controllers/riderBookingCoordinates';

class RiderBookingCoordinatesRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post(
            '/',
            authenticate,
            expressAsyncHandler((req, res) => {
                RiderBookingCoordinatesLog.create(req, res);
            })
        );

        return this.router;
    }
}

export const riderBookingCoordinatesRoutes: RiderBookingCoordinatesRoutes = new RiderBookingCoordinatesRoutes();
