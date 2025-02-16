import mongoose, { Document, Schema } from "mongoose";

interface IOrder extends Document {}

const orderSchema = new Schema<IOrder>(
  {},
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
