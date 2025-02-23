import Joi from "joi";

const addCoupon = {
  body: Joi.object({
    discount_type: Joi.string().valid("fixed", "percentage").optional(),

    discount_value: Joi.number().positive().required(),

    min_purchase_amount: Joi.number().positive().required(),
    max_discount_amount: Joi.number().positive().required(),

    usage_limit: Joi.number().integer().positive().required(),

    start_date: Joi.date().iso().required(),
    expiry_date: Joi.date().iso().greater(Joi.ref("start_date")).required(),
  }),
};

const updateCoupon = {
  body: Joi.object({
    discount_type: Joi.string().valid("fixed", "percentage").optional(),

    discount_value: Joi.number().positive().optional(),

    min_purchase_amount: Joi.number().positive().optional(),
    max_discount_amount: Joi.number().positive().optional(),

    usage_limit: Joi.number().integer().positive().optional(),

    start_date: Joi.date().iso().optional(),
    expiry_date: Joi.date().iso().greater(Joi.ref("start_date")).optional(),
  }).or(
    "discount_type",
    "discount_value",
    "min_purchase_amount",
    "max_discount_amount",
    "usage_limit",
    "start_date",
    "expiry_date"
  ),
  params: Joi.object({
    id: Joi.string().trim().required(),
  }),
};

const paramsVal = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export { addCoupon, updateCoupon, paramsVal };
