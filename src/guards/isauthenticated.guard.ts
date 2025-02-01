import { RequestHandler } from "express";

import { ErrorCodes } from "../types/errors-code.type";
import { IjwtPayload } from "../types/jwt-payload";
import { Errors } from "../errors";

export const isauthenticated: RequestHandler = async (req, res, next) => {
  const loggedUser = req.loggedUser as IjwtPayload;
  if (!loggedUser?.user_id)
    return next(new Errors.Unauthenticated(ErrorCodes.UNAUTHENTICATED));
  next();
};
