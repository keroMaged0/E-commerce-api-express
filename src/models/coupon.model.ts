import mongoose, { Document, Schema } from "mongoose";

interface ICoupon extends Document {}

const couponSchema = new Schema<ICoupon>(
  {},
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
