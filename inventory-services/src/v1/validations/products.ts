import { IProduct } from '@product/models/product';
import Joi, { ObjectSchema } from 'joi';


export const validateSchema = (inputs: Record<string, any>, schema: ObjectSchema): void => {
  const { error } = schema.validate(inputs);
  if (error) {
    throw new Error(error.details ? error.details[0].message.replace(/['"]+/g, '') : 'Validation failed');
  }
};
export const validateUpdateProduct = (payload: IProduct) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    quantity: Joi.number().optional(),
    price: Joi.number().optional(),
  })
  return validateSchema(payload, schema);
};
