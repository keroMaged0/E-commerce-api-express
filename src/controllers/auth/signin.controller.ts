import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { IjwtPayload } from "../../types/jwt-payload";
import { User } from "../../models/user.model";
import { env } from "../../config/env";
import { Errors } from "../../errors";
import { Utils } from "../../utils";

interface ISigninHandlerBody {
  email: string;
  password: string;
}

export const signinHandler: RequestHandler<
  unknown,
  SuccessResponse,
  ISigninHandlerBody
> = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) return next(new Errors.BadRequest(ErrorCodes.INVALID_CREDINTIALS));

  const isMatch = await Utils.Bcrypt.comparePassword(
    password,
    user.password,
    env.bcrypt.paper as string
  );
  if (!isMatch)
    return next(new Errors.BadRequest(ErrorCodes.INVALID_CREDINTIALS));

  if (!user.is_verified)
    return next(new Errors.BadRequest(ErrorCodes.USER_NOT_VERIFIED));

  if (!user.token || !Utils.Tokens.isValidToken(user.token)) {
    const token = Utils.Tokens.generateRefreshToken({ id: user.id });
    user.token = token as any;
    await user.save();
  }

  const accessToken = Utils.Tokens.generateAccessToken({
    user_id: user._id,
    role: user.role,
    is_verified: user.is_verified,
  } as IjwtPayload);

  res.status(201).json({
    success: true,
    message: "User signed in successfully",
    data: { access_token: accessToken, refresh_token: user.token },
  });
};
