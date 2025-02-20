import Joi from "joi";

const addToCart = {
  body: Joi.object({
    productId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Product ID must be a valid MongoDB ObjectId",
        "any.required": "Product ID is required",
      }),
    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
  }),
};

const updateQuantity = {
  body: Joi.object({
    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
  }),
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

export { addToCart, updateQuantity, paramsVal };
