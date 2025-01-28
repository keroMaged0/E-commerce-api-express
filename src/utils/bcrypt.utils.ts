import { hash, compare } from "bcryptjs";

const hashPassword = async (
  password: string,
  salt: number,
  paper: string
): Promise<string> => {
  const hashedPassword = await hash(password + paper, salt);
  return hashedPassword;
};

const comparePassword = async (
  password: string,
  hashed: string,
  paper: string
): Promise<Boolean> => {
  const comperedPassword = await compare(password + paper, hashed);
  return comperedPassword;
};

export const Bcrypt = { hashPassword, comparePassword };
