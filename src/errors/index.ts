import { BadRequest } from "./bad-request.error";
import { AppError } from "./app-error.error";
import { NotFoundError } from "./not-found-error";
import { Unauthenticated } from "./unauthenticated-error";
import { Unauthorized } from "./unauthorized-error";
import { internalServerError } from "./internal-server.error";

export const Errors = {
  AppError,
  BadRequest,
  NotFoundError,
  Unauthenticated,
  Unauthorized,
  internalServerError,
};
