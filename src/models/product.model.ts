import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

export interface IImage {
  public_id: string;
  secure_url: string;
  folder_id: string;
}

export enum IDiscount_type {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;

  base_price: number;
  discount: number;
  discount_type: IDiscount_type;

  applied_price: number;
  stock: number;
  rate: number;

  is_available: boolean;
  is_deleted: boolean;

  created_by: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  brand_id: mongoose.Types.ObjectId;

  images?: IImage[];
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: false,
      minlength: 10,
    },
    discount_type: {
      type: String,
      enum: IDiscount_type,
      required: false,
      default: IDiscount_type.PERCENTAGE,
    },
    base_price: {
      type: Number,
      required: [true, "base price is required"],
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
    applied_price: {
      type: Number,
      required: false,
      default: null,
    },
    stock: {
      type: Number,
      required: false,
      default: 0,
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },

    images: [
      {
        public_id: {
          type: String,
          required: false,
          default: null,
        },
        secure_url: {
          type: String,
          required: false,
          default: null,
        },
        folder_id: {
          type: String,
          required: false,
          default: null,
        },
      },
    ],

    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand_id: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

productSchema.pre("save", function (this: IProduct, next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.virtual("category", {
  ref: "Category",
  localField: "category_id",
  foreignField: "_id",
  justOne: true,
});
productSchema.virtual("brand", {
  ref: "Brand",
  localField: "brand_id",
  foreignField: "_id",
  justOne: true,
});

productSchema.pre("find", function () {
  this.where({ is_deleted: false });
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
