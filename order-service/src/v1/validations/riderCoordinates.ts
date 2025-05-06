import { FIRST_STATE, SECOND_STATE } from '@logs/models/riderCoordiantes';
import { Request } from 'express';
import Joi, { ObjectSchema } from 'joi';

export type RequestProperties<T extends keyof Request> = Request[T];

export const validateSchema = (inputs: Record<string, any>, schema: ObjectSchema): void => {
  const { error } = schema.validate(inputs);
  if (error) {
    throw new Error(error.details ? error.details[0].message.replace(/['"]+/g, '') : 'Validation failed');
  }
};
export const validateSaveCoordinates = <T extends keyof Request>(req: Request, property: T) => {
  // Schema to validate the entire document
  const schema = Joi.object({
    userId: Joi.string().optional(),
    deviceToken: Joi.string().optional(),
    coordinate: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
      firstState: Joi.string().valid(...Object.values(FIRST_STATE)).optional(),
      secondState: Joi.string().valid(...Object.values(SECOND_STATE)).optional(),
    })
  }).xor('userId', 'deviceToken');
  return validateSchema(req[property] as RequestProperties<T>, schema);
};
