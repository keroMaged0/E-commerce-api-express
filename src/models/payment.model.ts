import mongoose, { Document, Schema } from "mongoose";

export enum PaymentMethodEnum {
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

export interface IPayment extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  order_id: mongoose.Schema.Types.ObjectId;
  payment_method: PaymentMethodEnum;
  payment_receipt_url?: string;
  payment_status: PaymentStatus;
  refund_transaction_id?: string;
  refund_status?: RefundStatus;
  amount: number;
  payment_date: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethodEnum),
      required: true,
    },
    amount: { type: Number, required: true },
    refund_transaction_id: { type: String },
    payment_receipt_url: { type: String },
    payment_status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    payment_date: { type: Date, default: Date.now, required: true },
    refund_status: { type: String, enum: Object.values(RefundStatus), default: null },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
