import Joi from "joi";

const addReview = {
  body: Joi.object({
    review_rate: Joi.number().required().min(1).max(5),
    review_comment: Joi.string()
      .trim()
      .min(2)
      .max(255)
      .messages({
        "string.min": "Review comment is too short",
        "string.max": "Review comment is too long",
      })
      .required(),
    product_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    order_id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};
0;
const updateReview = {
  body: Joi.object({
    review_rate: Joi.number().optional().min(1).max(5),
    review_comment: Joi.string()
      .trim()
      .min(2)
      .max(255)
      .messages({
        "string.min": "Review comment is too short",
        "string.max": "Review comment is too long",
      })
      .optional(),
  }).or("review_rate", "review_comment"),

  params: Joi.object({
    id: Joi.string().trim().required(),
  }),
};

const paramsVal = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export { addReview, updateReview, paramsVal };
