import { IProduct } from '@inventory/models/product';
import { Request } from 'express';
import Joi, { ObjectSchema } from 'joi';

export type RequestProperties<T extends keyof Request> = Request[T];

export const validateSchema = (inputs: Record<string, any>, schema: ObjectSchema): void => {
  const { error } = schema.validate(inputs);
  if (error) {
    throw new Error(error.details ? error.details[0].message.replace(/['"]+/g, '') : 'Validation failed');
  }
};
export const validateUpdateProduct = (payload: IProduct) => {
  const schema = Joi.object({
    quantity: Joi.number().required(),
    _id: Joi.string().required()
  })
  return validateSchema(payload, schema);
};

export const validateCreateProduct = <T extends keyof Request>(req: Request, property: T) => {
  const schema = Joi.object({
    quantity: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required()
  })
  return validateSchema(req[property] as RequestProperties<T>, schema);
};
