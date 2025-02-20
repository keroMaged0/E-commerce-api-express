import mongoose from "mongoose";

import { ICart } from "../models/cart.model";

export interface OrderCalculationResult {
  tax_price: number;
  shipping_price: number;
  total_price: number;
  couponObjectId: mongoose.Types.ObjectId | null;
}

export const calculateOrderValues = (
  cart: ICart,
  coupon_id?: string
): OrderCalculationResult => {
  const tax_price = cart.sub_total * 0.1;
  const shipping_price = 0;
  const total_price =
    cart.total_price_after_discount + tax_price + shipping_price;
  const couponObjectId = coupon_id
    ? new mongoose.Types.ObjectId(coupon_id)
    : null;

  return { tax_price, shipping_price, total_price, couponObjectId };
};
