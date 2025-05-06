import riderCoordinates, { IRiderCoordinates } from '@logs/models/riderCoordiantes';
import { Response } from 'express';
import { validateSaveCoordinates } from '../validations/riderCoordinates';
import { sendFailResponse, sendSuccessResponse } from '@logs/utility/response';
import { AuthenticatedRequest } from '@logs/middlewares/authMiddleware';
import { RESPONSE, USER_ROLE } from '@logs/utility/constant';
import moment from 'moment';
import { exportAllRidersCoordinates, getAllRidersCoordinates, saveRiderCoordinates } from '@logs/v1/services/riderCoordinates';

export class RiderCoordiantesLog {
  /**
   * We have a feature that where we need to save the rider coordiantes(lat, lng) after every 3 hours
   * Rider app will use this api to save logs
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
      await validateSaveCoordinates(req, 'body');

      const data = await saveRiderCoordinates({
        userId: req.body.userId,
        deviceToken: req.body.deviceToken,
        appId,
        coordinate: req.body.coordinate
      });

      return sendSuccessResponse(req, res, data, RESPONSE.CREATED, 'Rider Coordinates saved');
    } catch (error: any) {
      return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, error.message || 'Validation error');
    }
  }
  /**
   * Dispatcher will send the api request to fetch all the rider coordiantes logs of the specific driver
   * @param req
   * @param res
   * @returns
   */
  static async findRiderCoordinates(req: AuthenticatedRequest, res: Response): Promise<void> {
    const appId = req.headers.appid;
    const userId = req.query.userId;
    const startDate = req.query.startDate ? new Date(req.query.startDate.toString()) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate.toString()) : null;

    // Authorization check
    if (!req.user || req.user.role !== USER_ROLE.ADMIN) {
      return sendFailResponse(req, res, RESPONSE.UN_AUTHORIZED, 'Unauthorized Access');
    }
    if (!appId) {
      return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, 'appid is missing in headers');
    }
    if (!userId) {
      return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, 'userId is missing');
    }
    const filter: Record<string, string | object> = {
      userId,
      appId
    };
    if (startDate && endDate) {
      filter['coordinates.created'] = {
        $gte: new Date(moment(startDate).startOf('day').toDate()),
        $lte: new Date(moment(endDate).endOf('day').toDate())
      };
    }
    const data = await riderCoordinates.findOne(filter).sort({ 'coordinates.created': -1 }).lean();

    if (!data) {
      const result = await riderCoordinates.findOne({ 'userId': userId }, 'rider appId').lean();
      return sendSuccessResponse(req, res, { rider: result?.rider!, coordinates: [], appId: result?.appId!, userId } as IRiderCoordinates, RESPONSE.OK, 'Rider Coordinates fetched');
    }
    if (data && data.coordinates) {
      data.coordinates.sort((a, b) => b.created.getTime() - a.created.getTime());
    }

    return sendSuccessResponse(req, res, data as IRiderCoordinates, RESPONSE.OK, 'Rider Coordinates fetched');
  }

  static async findAllRidersCoordinates(req: AuthenticatedRequest, res: Response): Promise<void> {
    const appId = req.headers.appid?.toString();
    const startDate = req.query.startDate ? new Date(req.query.startDate.toString()) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate.toString()) : null;

    // Authorization check
    if (!appId) {
      return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, 'appid is missing in headers');
    }

    const results = await getAllRidersCoordinates({ startDate, endDate, appId });

    return sendSuccessResponse(req, res, { riders: results }, RESPONSE.OK, 'Rider Coordinates fetched');
  }
  static async exportCoordinates(req: AuthenticatedRequest, res: Response): Promise<void> {
    const appId = req.headers.appid?.toString();
    // Authorization check
    if (!appId) {
      return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, 'appid is missing in headers');
    }

    await exportAllRidersCoordinates(req, res);

    // return sendSuccessResponse(req, res, results, RESPONSE.OK, 'Rider Coordinates fetched');
  }
}
