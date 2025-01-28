import { SHA256, lib, enc } from "crypto-js";

const hashCode = (code: string) => {
  return SHA256(code).toString(enc.Hex);
};

const generateCode = (length: number = 3): string => {
  const randomBytes = lib.WordArray.random(length);
  return randomBytes.toString(enc.Hex);
};

export const Crypto = { hashCode, generateCode };
