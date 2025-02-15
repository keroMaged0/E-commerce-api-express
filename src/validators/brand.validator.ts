import Joi from "joi";

const createBrand = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().optional(),
  }),
};

const updateBrand = {
  body: Joi.object({
    name: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    old_public_id: Joi.string().trim().optional(),
  }).or("name", "description", "old_public_id"),
  params: Joi.object({
    id: Joi.string().trim().required(),
  }),
};

const paramsVal = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export { createBrand, updateBrand, paramsVal };
