import { Request, Response } from 'express';
import { validateCreateOrder, validateCancelOrder } from '../validations/orders';
import { sendFailResponse, sendSuccessResponse } from '@order/utility/response';
import { RESPONSE } from '@order/utility/constant';
import { cancelOrder, createOrder } from '@order/v1/services/orders';

export class OrderController {

  /**
   * We have a feature that where a customer can create an order
   * @param req
   * @param res
   * @returns {Promise<void>} - A newly created order
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      await validateCreateOrder(req, 'body');
      return sendSuccessResponse(req, res, await createOrder(req.body), RESPONSE.CREATED, 'Order created successfully');
    } catch (error: any) {
      console.error('Order creation failed:', error);
      return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, error.message || 'Validation error');
    }
  }
  static async cancel(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      if (!orderId) {
        return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, 'order id is missing');
      }
      await validateCancelOrder(req, 'body');
      return sendSuccessResponse(req, res, await cancelOrder(orderId, req.body), RESPONSE.OK, 'Order cancelled successfully');
    } catch (error: any) {
      console.error('Order cancelled failed:', error);
      return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, error.message || 'Validation error');
    }
  }
}
