import { RequestHandler } from "express";
import { Errors } from "../errors";

export const isauthorized = (permission: string) => <RequestHandler>(async (
    req,
    res,
    next
  ) => {
    if (!req.loggedUser?.role.includes(permission))
      return next(new Errors.Unauthorized());
    next();
  });
