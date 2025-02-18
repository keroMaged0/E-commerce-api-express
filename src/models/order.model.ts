import mongoose, { Document, Schema } from "mongoose";

export interface IShippingAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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
  PAYPAL = "paypal",
}

interface IOrder extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  delivered_by?: mongoose.Schema.Types.ObjectId;
  order_items: mongoose.Schema.Types.ObjectId[];

  shipping_address: IShippingAddress;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  
  payment_transaction_id?: string;
  payment_status?: string;
  
  shipping_price: number;
  coupon_price: number;
  tax_price: number;
  total_price: number;
  
  is_delivered: boolean;
  
  expected_delivery?: Date;
  delivered_at?: Date;
  payment_date?: Date; 
  cancelled_at?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    delivered_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    shipping_address: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    payment_transaction_id: { type: String },
    payment_status: { type: String },
    payment_date: { type: Date },
    order_status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    shipping_price: { type: Number, required: true, default: 0 },
    coupon_price: { type: Number, default: 0 },
    tax_price: { type: Number, default: 0 },
    total_price: { type: Number, required: true },
    is_delivered: { type: Boolean, default: false },
    delivered_at: { type: Date },
    cancelled_at: { type: Date },
    expected_delivery: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
