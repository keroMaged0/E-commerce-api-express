import Joi from "joi";

const createReview = {
  body: Joi.object({}),
};

const updateReview = {
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

export { createReview, updateReview, paramsVal };
