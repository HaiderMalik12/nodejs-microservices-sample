import { Response } from 'express';
import { sendFailResponse, sendSuccessResponse } from '@logs/utility/response';
import { AuthenticatedRequest } from '@logs/middlewares/authMiddleware';
import { RESPONSE } from '@logs/utility/constant';
import { saveRiderBookingCoordinates } from '@logs/v1/services/riderBookingCoordinates';
import { validateSaveBookingCoordinates } from '../validations/riderBookingCoordinates';

export class RiderBookingCoordinatesLog {
    /**
     * We have a feature if rider off the GPS/internet where we need to save the rider booking related coordiantes(lat, lng) in the device
     * If rider connects the GPS we are saving coordinates to the DB
     * Rider app will use this api to save booking related coordinates logs
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
            await validateSaveBookingCoordinates(req, 'body');

            const data = await saveRiderBookingCoordinates({
                userId: req.body.userId,
                bookingId: req.body.bookingId,
                appId,
                coordinates: req.body.coordinates
            });

            return sendSuccessResponse(req, res, data, RESPONSE.CREATED, 'Rider Booking Coordinates saved');
        } catch (error: any) {
            return sendFailResponse(req, res, RESPONSE.BAD_REQUEST, error.message || 'Validation error');
        }
    }
}
