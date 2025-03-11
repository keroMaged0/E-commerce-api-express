import Joi from "joi";

const addToWishlist = {
  body: Joi.object({
    product_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Product ID must be a valid MongoDB ObjectId",
        "any.required": "Product ID is required",
      }),
  }),
};

const paramsVal = {
  params: Joi.object({
    product_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Product ID must be a valid MongoDB ObjectId",
        "any.required": "Product ID is required",
      }),
  }),
};

export { addToWishlist, paramsVal };
