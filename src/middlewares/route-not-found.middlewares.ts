import { RequestHandler } from "express";

import { ErrorCodes } from "../types/errors-code.type";
import { Errors } from "../errors";

export const routeNotFound: RequestHandler = (req, res, next) => {
  return next(new Errors.NotFoundError(ErrorCodes.NOT_FOUND));
};
