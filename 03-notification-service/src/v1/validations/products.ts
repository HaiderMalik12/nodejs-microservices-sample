import Joi, { ObjectSchema } from 'joi';


export const validateSchema = (inputs: Record<string, any>, schema: ObjectSchema): void => {
  const { error } = schema.validate(inputs);
  if (error) {
    throw new Error(error.details ? error.details[0].message.replace(/['"]+/g, '') : 'Validation failed');
  }
};
export const validateInventoryMessage = (payload: any) => {
  const schema = Joi.object({
    quantity: Joi.number().required(),
    productId: Joi.string().required()
  })
  return validateSchema(payload, schema);
};
