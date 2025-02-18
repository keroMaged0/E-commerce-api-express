import Joi from "joi";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createOrder = {
  body: Joi.object({
    order_items: Joi.array()
      .items(Joi.string().pattern(objectIdRegex))
      .min(1)
      .required(),

    shipping_address: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().required(),
    }).required(),

    payment_method: Joi.string().valid("credit_card", "paypal").required(),

    payment_transaction_id: Joi.string().optional(),
    payment_status: Joi.string().optional(),
    payment_date: Joi.date().optional(),

    order_status: Joi.string()
      .valid("pending", "completed", "cancelled")
      .optional(),

    shipping_price: Joi.number().min(0).required(),
    coupon_price: Joi.number().min(0).default(0),
    tax_price: Joi.number().min(0).default(0),
    total_price: Joi.number().min(0).required(),

    is_delivered: Joi.boolean().default(false),

    expected_delivery: Joi.date().optional(),
    delivered_at: Joi.date().optional(),
    cancelled_at: Joi.date().optional(),
  }),
};

const updateOrder = {
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().trim().required(),
  }),
};

const paramsVal = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export { createOrder, updateOrder, paramsVal };
