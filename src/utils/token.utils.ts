import { sign, verify } from "jsonwebtoken";
import { env } from "../config/env";

const generateAccessToken = (payload: any) =>
  sign(payload, env.token.secret, { expiresIn: "1h" });

const generateRefreshToken = (payload: { id: string }) =>
  sign(payload, env.token.secret, { expiresIn: "1y" });

const verifyToken = async (token: string) => {
  try {
    const payload = await verify(token, env.token.secret);
    return payload;
  } catch (error) {
    return undefined;
  }
};

const isValidToken = (token: string) => {
  try {
    verify(token, env.token.secret);
    return true;
  } catch (error) {
    return false;
  }
};

export const Tokens = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  isValidToken,
};
