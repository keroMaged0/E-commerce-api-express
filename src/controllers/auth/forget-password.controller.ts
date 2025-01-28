import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { VerifyReason } from "../../types/verify-reason";
import { User } from "../../models/user.model";
import { env } from "../../config/env";
import { Errors } from "../../errors";
import { Utils } from "../../utils";

export const askForgetPasswordHandler: RequestHandler<
  unknown,
  SuccessResponse,
  { email: string }
> = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Errors.BadRequest(ErrorCodes.INVALID_CREDINTIALS));

  if (!user.is_verified)
    return next(new Errors.BadRequest(ErrorCodes.USER_NOT_VERIFIED));

  const code = Utils.Crypto.generateCode();
  const expireeTime = new Date(Date.now() + 10 * 60 * 1000);

  user.verification_code = code;
  user.verification_expire_at = expireeTime;
  user.verification_reason = VerifyReason.forgetPassword;
  await user.save();

  // Send email to user with code
  await Utils.mailTransporter.sendMail({
    from: env.sendEmail.auth.user as string,
    to: email,
    subject: "Password Reset Code",
    html: `<h1>Your password reset code is: ${code}</h1>`,
  });

  res.status(200).json({
    success: true,
    message: "Password reset code sent successfully",
    data: {},
  });
};

export const updateForgetenPasswordHandler: RequestHandler<
  unknown,
  SuccessResponse,
  { email: string; new_password: string; verification_code: string }
> = async (req, res, next) => {
  const { email, new_password, verification_code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Errors.BadRequest(ErrorCodes.INVALID_CREDINTIALS));

  if (user.verification_code !== verification_code)
    return next(new Errors.BadRequest(ErrorCodes.INVALID_VERIFICATION_CODE));

  if (!user.is_verified)
    return next(new Errors.BadRequest(ErrorCodes.USER_NOT_VERIFIED));

  if (user.verification_reason != VerifyReason.forgetPassword)
    return next(new Errors.BadRequest(ErrorCodes.NO_REASON_TO_RESEND_CODE));

  user.token = Utils.Tokens.generateRefreshToken({ id: user._id as string });
  user.password = await Utils.Bcrypt.hashPassword(
    new_password,
    env.bcrypt.salt,
    env.bcrypt.paper as string
  );

  user.verification_code = null as any;
  user.verification_expire_at = null as any;
  user.verification_reason = null as any;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: {},
  });
};
