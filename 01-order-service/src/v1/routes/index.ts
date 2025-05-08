import express from 'express';
import { ordersRoutes } from './orders';
const router = express.Router();

router.use('/orders', ordersRoutes.routes());

export default router;
