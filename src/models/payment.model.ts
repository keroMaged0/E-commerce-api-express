import mongoose, { Document, Schema } from "mongoose";

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  PAYPAL = "paypal",
}

export enum RefundStatus {
  REQUESTED = "requested",
  PROCESSED = "processed",
  FAILED = "failed",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

interface IPayment extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  order_id: mongoose.Schema.Types.ObjectId;

  payment_method: PaymentMethod;

  payment_receipt_url?: string;
  payment_status?: PaymentStatus;
  transaction_id?: string;
  refund_status?: RefundStatus;

  amount: number;

  payment_date: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    payment_method: {
      type: String,
      enum: PaymentMethod,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_id: {
      type: String,
      required: false,
    },
    payment_receipt_url: {
      type: String,
      required: false,
    },
    payment_status: {
      type: String,
      enum: PaymentStatus,
      required: false,
      default: PaymentStatus.PENDING,
    },
    payment_date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    refund_status: {
      type: String,
      enum: RefundStatus,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
