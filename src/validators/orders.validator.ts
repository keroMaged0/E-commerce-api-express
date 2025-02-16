import Joi from "joi";

const createOrder = {
  body: Joi.object({}),
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
