import mongoose, { Document, Schema } from "mongoose";

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}
interface ICoupon extends Document {
  code: string;

  discount_type: DiscountType;

  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  usage_limit: number;
  used_count: number;

  status: boolean;
  is_deleted: boolean;

  start_date: Date;
  expiry_date: Date;

  users_used: mongoose.Schema.Types.ObjectId[];
  created_by: mongoose.Schema.Types.ObjectId;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount_type: {
      type: String,
      enum: Object.values(DiscountType),
      default: DiscountType.PERCENTAGE,
    },
    discount_value: {
      type: Number,
      required: true,
    },
    min_purchase_amount: {
      type: Number,
      required: true,
    },
    max_discount_amount: {
      type: Number,
      required: true,
    },
    usage_limit: {
      type: Number,
      required: true,
    },
    used_count: {
      type: Number,
      default: 0,
    },
    users_used: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    status: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    start_date: {
      type: Date,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

couponSchema.pre("find", function (next) {
  this.where({ is_deleted: false });
  next();
});

export const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
