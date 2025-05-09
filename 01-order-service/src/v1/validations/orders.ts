import { Request } from 'express';
import Joi, { ObjectSchema } from 'joi';

export type RequestProperties<T extends keyof Request> = Request[T];

export const validateSchema = (inputs: Record<string, any>, schema: ObjectSchema): void => {
  const { error } = schema.validate(inputs);
  if (error) {
    throw new Error(error.details ? error.details[0].message.replace(/['"]+/g, '') : 'Validation failed');
  }
};
export const validateCreateOrder = <T extends keyof Request>(req: Request, property: T) => {
  // Schema to validate the entire document
  const schema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
  })
  return validateSchema(req[property] as RequestProperties<T>, schema);
};
export const validateCancelOrder = <T extends keyof Request>(req: Request, property: T) => {
  // Schema to validate the entire document
  const schema = Joi.object({
    reason: Joi.string().required(),
  })
  return validateSchema(req[property] as RequestProperties<T>, schema);
};
