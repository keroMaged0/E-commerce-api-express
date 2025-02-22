import mongoose, { Document, Schema } from "mongoose";
import { Product } from "./product.model";

interface IReview extends Document {
  review_comment: string;

  review_rate: number;

  product_id: mongoose.Schema.Types.ObjectId;
  order_id: mongoose.Schema.Types.ObjectId;
  created_by: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;

  is_deleted: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    review_rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review_comment: {
      type: String,
      trim: true,
      minlength: [2, "too short reviews comment"],
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

reviewSchema.pre("find", function () {
  this.where({ is_deleted: false });
});

reviewSchema.post("save", async function (doc) {
  await Product.findByIdAndUpdate(doc.product_id, {
    $push: { reviews: doc._id },
  });
});

export const Review = mongoose.model<IReview>("Review", reviewSchema);
