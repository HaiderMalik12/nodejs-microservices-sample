import express from 'express';
import { riderCoordinatesRoutes } from './riderCoordinates';
import { riderBookingCoordinatesRoutes } from './riderBookingCoordinates';
import { walletTransactionRoutes } from './walletTransactions';
const router = express.Router();

router.use('/rider/coordinates', riderCoordinatesRoutes.routes());
router.use('/rider/booking/coordinates', riderBookingCoordinatesRoutes.routes());
router.use('/wallet/transactions/logs', walletTransactionRoutes.routes());

export default router;
