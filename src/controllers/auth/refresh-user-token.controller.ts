import { RequestHandler } from "express";

import { Unauthenticated } from "../../errors/unauthenticated-error";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { IjwtPayload } from "../../types/jwt-payload";
import { Tokens } from "../../utils/token.utils";
import { User } from "../../models/user.model";

export const refreshUserToken: RequestHandler<
  unknown,
  SuccessResponse
> = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new Unauthenticated(ErrorCodes.UNAUTHENTICATED));

  const decoded = await Tokens.verifyToken(token);
  if (!decoded) return next(new Unauthenticated(ErrorCodes.UNAUTHENTICATED));

  const user = await User.findById(decoded.user_id);
  if (!user) return next(new Unauthenticated(ErrorCodes.INVALID_TOKEN));

  const newToken = Tokens.generateAccessToken({
    user_id: user._id,
    role: user.role,
    is_verified: user.is_verified,
  } as IjwtPayload);

  res.json({
    success: true,
    message: "User token refreshed successfully",
    data: { access_token: newToken },
  });
};
