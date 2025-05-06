
import { ENTITY_TYPE, OPERATION_TYPE } from '@logs/models/walletTransactionsLogs';
import { Request } from 'express';
import Joi from 'joi';
import { validateSchema } from './riderCoordinates';

type RequestProperties<T extends keyof Request> = Request[T];

export const validateSaveWalletTransaction = <T extends keyof Request>(req: Request, property: T) => {
    const schema = Joi.object({
        orderId: Joi.string().required(),
        type: Joi.string()
            .valid(...Object.values(OPERATION_TYPE))
            .required(),
        entity: Joi.string()
            .valid(...Object.values(ENTITY_TYPE))
            .required(),
        balanceBefore: Joi.number().optional(),
        balanceAfter: Joi.number().optional(),
        holdAmountBefore: Joi.number().optional(),
        holdAmountAfter: Joi.number().optional(),
        earningAmountBefore: Joi.number().optional(),
        earningAmountAfter: Joi.number().optional(),
        storeId: Joi.string().optional(),
        riderId: Joi.string().optional(),
        bookingId: Joi.string().optional(),
        appId: Joi.string().optional(),
    });
    return validateSchema(req[property] as RequestProperties<T>, schema);
};
