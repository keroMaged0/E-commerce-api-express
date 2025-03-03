import Joi from "joi";

const initiatePayment = {
  body: Joi.object({}),
};

export { initiatePayment };
