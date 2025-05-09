import express, { Router } from 'express';
import { ProductController } from '../controllers/products';
import expressAsyncHandler from 'express-async-handler';

class ProductRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      '/',
      expressAsyncHandler((req, res) => {
        ProductController.create(req, res);
      })
    );

    return this.router;
  }
}

export const productRoutes: ProductRoutes = new ProductRoutes();
