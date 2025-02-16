import Joi from "joi";

const createProduct = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().min(10).max(200).optional(),
    base_price: Joi.number().min(1).required(),
    discount: Joi.number().min(1).optional(),
    stock: Joi.number().min(0).required(),
    category_id: Joi.string()
      .regex(/^[a-fA-F0-9]{24}$/)
      .required(),
    brand_id: Joi.string()
      .regex(/^[a-fA-F0-9]{24}$/)
      .required(),
  }),
};

const updateProduct = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(50).optional(),
    description: Joi.string().trim().min(10).max(200).optional(),
    base_price: Joi.number().min(1).optional(),
    discount: Joi.number().min(1).optional(),
    stock: Joi.number().min(0).optional(),
    category_id: Joi.string().trim().optional(),
    oldPublicId: Joi.string().trim().optional(),
    brand_id: Joi.string().trim().optional(),
  }),
  params: Joi.object({
    id: Joi.string().trim().required(),
  }),
};

const paramsVal = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export { createProduct, updateProduct, paramsVal };
