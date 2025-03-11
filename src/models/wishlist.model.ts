import mongoose, { Document, Schema } from "mongoose";

export interface Iwishlist extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  products: mongoose.Schema.Types.ObjectId[];
  quantity: number;
}

const wishlistSchema = new Schema<Iwishlist>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const Wishlist = mongoose.model<Iwishlist>("Wishlist", wishlistSchema);
