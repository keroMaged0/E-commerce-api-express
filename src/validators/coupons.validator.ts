import Joi from "joi";

const createCoupon = {
  body: Joi.object({}),
};

const updateCoupon = {
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

export { createCoupon, updateCoupon, paramsVal };
