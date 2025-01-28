import mongoose, { Document, Schema } from "mongoose";

export enum UserType {
  ADMIN = "admin",
  USER = "user",
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  address?: string;
  avatar?: string;

  fcm_token?: string;
  role: UserType;
  verification_code: string;
  verification_reason?: string;
  token?: string;

  verification_expire_at?: Date;
  birth_date?: Date;

  is_verified?: boolean;
}

const userSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: null },
    gender: { type: String, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: null },
    fcm_token: { type: String, default: null },
    role: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.USER,
    },
    verification_code: { type: String, default: null },
    verification_reason: { type: String, default: null },
    token: { type: String, default: null },

    verification_expire_at: { type: Date, default: null },
    birth_date: { type: Date, default: null },

    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
