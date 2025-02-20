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
  coupon_id: mongoose.Schema.Types.ObjectId;
  order_items: mongoose.Schema.Types.ObjectId[];

  shipping_address: IShippingAddress;
  payment_method: PaymentMethod;
  order_status: OrderStatus;

  payment_transaction_id?: string;
  payment_status?: string;

  shipping_price: number;
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
    delivered_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
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
    payment_transaction_id: {
      type: String,
      required: false,
      default: null,
    },
    payment_status: {
      type: String,
      required: false,
      default: null,
    },
    payment_date: {
      type: Date,
      required: false,
      default: null,
    },
    order_status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    shipping_price: {
      type: Number,
      required: true,
      default: 0,
    },
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

orderSchema.pre("find", function (next) {
  this.where({ order_status: { $ne: OrderStatus.CANCELLED } });
  next();
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
