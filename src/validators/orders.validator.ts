import Joi from "joi";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addOrder = {
  body: Joi.object({
    shipping_address: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      street: Joi.string().required(),
      postalCode: Joi.string().required(),
      phone: Joi.string().required(),
    }).required(),

    payment_method: Joi.string().valid("credit_card", "cache").required(),
  }),
};

const updateOrder = {
  body: Joi.object({
    shipping_address: Joi.object({
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      country: Joi.string().optional(),
      phone: Joi.string().optional(),
    }).optional(),

    payment_method: Joi.string().valid("credit_card", "paypal").optional(),

    order_status: Joi.string()
      .valid("pending", "completed", "cancelled")
      .optional(),

    coupon_id: Joi.string().pattern(objectIdRegex).optional(),
  }),
  params: Joi.object({
    order_id: Joi.string().pattern(objectIdRegex).required(),
  }),
};

const paramsVal = {
  params: Joi.object({
    order_id: Joi.string().pattern(objectIdRegex).required(),
  }),
};

export { addOrder, updateOrder, paramsVal };
