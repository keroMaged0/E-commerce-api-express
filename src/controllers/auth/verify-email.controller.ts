import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { User } from "../../models/user.model";
import { Errors } from "../../errors";

interface IVerifyEmailHandlerBody {
  email: string;
  verification_code: string;
}

export const verifyEmailHandler: RequestHandler<
  unknown,
  SuccessResponse,
  IVerifyEmailHandlerBody
> = async (req, res, next) => {
  const { email, verification_code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Errors.BadRequest(ErrorCodes.INVALID_CREDINTIALS));

  if (user.verification_code !== verification_code)
    return next(new Errors.BadRequest(ErrorCodes.INVALID_CREDINTIALS));

  user.is_verified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {},
  });
};
