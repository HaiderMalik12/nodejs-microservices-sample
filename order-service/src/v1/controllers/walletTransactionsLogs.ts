import { Response } from 'express';
import { sendFailResponse, sendSuccessResponse } from '@logs/utility/response';
import { AuthenticatedRequest } from '@logs/middlewares/authMiddleware';
import { RESPONSE } from '@logs/utility/constant';
import { validateSaveWalletTransaction } from '../validations/walletTransactionsLogs';
import { saveWalletTransaction } from '../services/walletTransactionsLogs';


export class WalletTransactionsLogs {
    /**
     * We have a feature that where we need to save the rider balance before order acceptance or after order acceptance
     * Similary save merchant balance before order creation and after order creation
     * @param req
     * @param res
     * @returns
     */
    static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
        const appId = req.headers.appid as string;

        if (!appId) {
            return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, 'appid is missing in headers');
        }

        try {
            await validateSaveWalletTransaction(req, 'body');

            const data = await saveWalletTransaction({ ...req.body, appId });

            return sendSuccessResponse(req, res, data, RESPONSE.CREATED, 'Wallet Transaction saved');
        } catch (error: any) {
            return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, error.message || 'Validation error');
        }
    }

}
