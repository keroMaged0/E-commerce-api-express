import { RequestHandler } from "express";

import { IjwtPayload } from "../types/jwt-payload";
import { User } from "../models/user.model";
import { Utils } from "../utils";

export const authentication: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();

  const validToken = (await Utils.Tokens.verifyToken(token)) as IjwtPayload;
  if (!validToken) return next();

  const role = await User.findOne({ role: validToken.role });
  if (!role) return next();

  req.loggedUser = {
    user_id: validToken.user_id,
    role: role.role,
    is_verified: validToken.is_verified,
  };

  next();
};
