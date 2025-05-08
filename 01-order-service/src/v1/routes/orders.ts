import express, { Router } from 'express';
import { OrderController } from '../controllers/orders';
import expressAsyncHandler from 'express-async-handler';

class OrderRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      '/',
      expressAsyncHandler((req, res) => {
        OrderController.create(req, res);
      })
    );

    return this.router;
  }
}

export const ordersRoutes: OrderRoutes = new OrderRoutes();
