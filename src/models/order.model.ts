import mongoose, { Document, Schema } from "mongoose";
import { ICartItem } from "./cart.model";

export interface IShippingAddress {
  address: string;
  city: string;
  street: string;
  postalCode: string;
  phone: string;
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  CASH_ON_DELIVERY = "cash_on_delivery",
}

interface IOrder extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  delivered_by?: mongoose.Schema.Types.ObjectId;
  cart_items: ICartItem[];

  shipping_address: IShippingAddress;
  payment_method: PaymentMethod;
  order_status: OrderStatus;

  sub_total: number;
  discount_price: number;
  total_price_after_discount: number;

  is_delivered: boolean;
  is_paid: boolean;

  delivered_at?: Date;
  paid_at?: Date;
  cancelled_at?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    delivered_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    cart_items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    shipping_address: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    order_status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    total_price_after_discount: {
      type: Number,
      required: true,
    },

    sub_total: { type: Number, required: true },
    discount_price: { type: Number, required: false },

    is_delivered: { type: Boolean, default: false },
    is_paid: { type: Boolean, default: false },

    delivered_at: { type: Date },
    paid_at: { type: Date },
    cancelled_at: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
