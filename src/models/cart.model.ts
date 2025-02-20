import mongoose, { Document, Schema, Types } from "mongoose";

interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}
export interface ICart extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  items: ICartItem[];

  total_items: number;
  sub_total: number;
  total_price_after_discount: number;

  discount_code?: string;
}

const cartSchema = new Schema<ICart>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
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

    total_items: {
      type: Number,
      required: true,
      default: 0,
    },
    sub_total: {
      type: Number,
      required: true,
      default: 0,
    },
    total_price_after_discount: {
      type: Number,
      required: true,
      default: 0,
    },

    discount_code: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

function calculateDiscount(discountCode: string, subTotal: number): number {
  return 0;
}

cartSchema.pre("save", function (next) {
  this.total_items = this.items.reduce((acc, item) => acc + item.quantity, 0);
  this.sub_total = this.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const discount = this.discount_code
    ? calculateDiscount(this.discount_code, this.sub_total)
    : 0;
  this.total_price_after_discount = this.sub_total - discount;
  next();
});

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
