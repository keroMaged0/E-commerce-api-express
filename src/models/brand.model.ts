import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  logo: {
    public_id: string;
    secure_url: string;
    folder_id: string;
  };

  is_deleted: boolean;

  created_by: mongoose.Types.ObjectId;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
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
    logo: {
      public_id: {
        type: String,
        default: null,
      },
      secure_url: {
        type: String,
        default: null,
      },
      folder_id: {
        type: String,
        default: null,
      },
    },
    is_deleted: {
      type: Boolean,
      default: false,
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

brandSchema.pre("save", function (this: IBrand, next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

brandSchema.pre("find", function () {
  this.where({ is_deleted: false });
});

export const Brand = mongoose.model<IBrand>("Brand", brandSchema);
