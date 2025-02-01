import Joi from "joi";

const signup = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(20).lowercase().required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    ),
    age: Joi.number().min(18).max(80).optional(),
    phone: Joi.array()
      .items(
        Joi.string()
          .regex(/^\+20\d{10}$/)
          .required()
      )
      .optional(),
    address: Joi.array()
      .items({
        street: Joi.string().required,
        city: Joi.string().required,
        homeName: Joi.string().required,
      })
      .optional(),
    role: Joi.string().optional(),
  }),
};

const signin = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .message(
        "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
      ),
  }),
};

const verification = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    verification_code: Joi.string().required(),
  }),
};

const resendVerification = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
  }),
};

const refreshToken = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
};

const changePassword = {
  body: Joi.object({
    old_password: Joi.string(),
    new_password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .message(
        "The new password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
      ),
  }),
};

const askForgetPassword = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
  }),
};

const updateForgetenPassword = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    verification_code: Joi.string().required(),
    new_password: Joi.string()
      .required()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .message(
        "The new password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
      ),
  }),
};


export {
  signup,
  signin,
  verification,
  resendVerification,
  refreshToken,
  changePassword,
  askForgetPassword,
  updateForgetenPassword,
};
