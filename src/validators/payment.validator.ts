import Joi from "joi";

const initiatePayment = {
  body: Joi.object({
    orderId: Joi.string().required(),
    paymentMethod: Joi.string().required(),
  }),
};

export { initiatePayment };
