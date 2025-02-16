import Joi from "joi";

const createCart = {
  body: Joi.object({}),
};

const updateCart = {
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

export { createCart, updateCart, paramsVal };
