import Joi from "joi";

const createCategory = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().min(10).max(200),
    parent_id: Joi.string().trim().optional().allow(null),
    image_url: Joi.string().trim().optional().allow(null),
  }),
};

const updateCategory = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(50).optional(),
    description: Joi.string().trim().min(10).max(200).optional(),
    parent_id: Joi.string().trim().optional().allow(null),
    image_url: Joi.string().trim().optional().allow(null),
  }).min(1),
  params: Joi.object({
    id: Joi.string().trim().required(),
  }),
};

const paramsVal = {
  params: Joi.object({
    id: Joi.string().trim().required(),
  }),
};

export { createCategory, updateCategory, paramsVal };
