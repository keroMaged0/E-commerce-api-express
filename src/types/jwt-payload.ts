import { UserType } from "../models/user.model";

export interface IjwtPayload {
  user_id: string;
  role: UserType;
  is_verified: boolean;
}
