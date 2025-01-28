import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { VerifyReason } from "../../types/verify-reason";
import { User } from "../../models/user.model";
import { env } from "../../config/env";
import { Errors } from "../../errors";
import { Utils } from "../../utils";

interface ISignupHandlerBody {
  name: string;
  email: string;
  password: string;
  phone: string;
  birth_date?: Date;
  fcm_token?: string;
  address?: string;
  gender?: string;
  avatar?: string;
  role?: string;
}

export const signupHandler: RequestHandler<
  unknown,
  SuccessResponse,
  ISignupHandlerBody
> = async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone,
    birth_date,
    fcm_token,
    address,
    gender,
    avatar,
    role,
  } = req.body;

  const code = await Utils.Crypto.generateCode(3);
  const hashPassword = await Utils.Bcrypt.hashPassword(
    password,
    env.bcrypt.salt,
    env.bcrypt.paper as string
  );

  const existingUser = await User.findOne({ email: email });
  if (existingUser)
    return next(new Errors.BadRequest(ErrorCodes.EMAIL_ALREADY_EXISTS));

  const user = new User({
    ...req.body,
    password: hashPassword,
    verification_code: code,
    verification_expire_at: new Date(Date.now() + 60000 * 15),
    verification_reason: VerifyReason.signup,
  });

  await user.save();

  // Send email verification
  await Utils.mailTransporter.sendMail({
    from: env.sendEmail.auth.user as string,
    to: email,
    subject: "Email Verification",
    html: `<h1>Your verification code is: ${code}</h1>`,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
};
