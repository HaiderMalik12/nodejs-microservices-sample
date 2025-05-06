import express, { Router } from 'express';
import { authenticate } from '@logs/middlewares/authMiddleware';
import expressAsyncHandler from 'express-async-handler';
import { WalletTransactionsLogs } from '../controllers/walletTransactionsLogs';

class WalletTransactionRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post(
            '/',
            authenticate,
            expressAsyncHandler((req, res) => {
                WalletTransactionsLogs.create(req, res);
            })
        );

        return this.router;
    }
}

export const walletTransactionRoutes: WalletTransactionRoutes = new WalletTransactionRoutes();
