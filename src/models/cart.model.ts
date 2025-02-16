import mongoose, { Document, Schema } from "mongoose";

interface ICart extends Document {}

const cartSchema = new Schema<ICart>(
  {},
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
