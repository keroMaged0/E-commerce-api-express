import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.error";
import { env } from "../config/env";
import { logger } from "../config/winston";

export const errorHandler: ErrorRequestHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (env.environment === "development") logger.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.serializeError() });
    return;
  }

  res.status(500).json({ errors: [{ message: "server error" }] });

  next();
};
