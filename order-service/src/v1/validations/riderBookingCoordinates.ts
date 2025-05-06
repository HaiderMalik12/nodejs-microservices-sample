import Joi from 'joi';
import { Request } from 'express';
import { RequestProperties, validateSchema } from './riderCoordinates';

export const validateSaveBookingCoordinates = <T extends keyof Request>(req: Request, property: T) => {
    const schema = Joi.object({
        userId: Joi.string().optional(),
        bookingId: Joi.string().optional(),
        coordinates: Joi.array().items(
            Joi.object({
                lat: Joi.number().required(),
                lng: Joi.number().required(),
            })
        ).required()
    })
    return validateSchema(req[property] as RequestProperties<T>, schema);
};
