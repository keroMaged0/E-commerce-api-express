import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { User } from "../../models/user.model";
import { env } from "../../config/env";
import { Errors } from "../../errors";
import { Utils } from "../../utils";

export const changePassword: RequestHandler<
  unknown,
  SuccessResponse,
  {
    old_password: string;
    new_password: string;
  }
> = async (req, res, next) => {
  const { old_password, new_password } = req.body;

  const user = await User.findById(req.loggedUser.user_id);
  if (!user) return next(new Errors.BadRequest(ErrorCodes.NOT_FOUND));

  const isMatch = await Utils.Bcrypt.comparePassword(
    old_password,
    user.password,
    env.bcrypt.paper as string
  );
  if (!isMatch)
    return next(new Errors.BadRequest(ErrorCodes.INVALID_CREDINTIALS));

  const hashPassword = await Utils.Bcrypt.hashPassword(
    new_password,
    env.bcrypt.salt,
    env.bcrypt.paper as string
  );
  user.password = hashPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been changed successfully",
    data: {},
  });
};
