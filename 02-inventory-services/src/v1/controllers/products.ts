import { Request, Response } from 'express';
import { validateCreateProduct } from '@inventory/v1/validations/products';
import { sendFailResponse, sendSuccessResponse } from '@inventory/utility/response';
import { RESPONSE } from '@inventory/utility/constant';
import { createProduct } from '@inventory/v1/services/products';

export class ProductController {

    /**
     * An Admin can add inventory to the store
     * @param req
     * @param res
     * @returns {Promise<void>} - A newly created product
     */
    static async create(req: Request, res: Response): Promise<void> {
        try {
            await validateCreateProduct(req, 'body');
            return sendSuccessResponse(req, res, await createProduct(req.body), RESPONSE.CREATED, 'Product created successfully');
        } catch (error: any) {
            console.error('Order creation failed:', error);
            return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, error.message || 'Validation error');
        }
    }
}
