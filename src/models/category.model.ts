import { Document, model, Model, Schema, Types } from "mongoose";
import slugify from "slugify";

interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image?: {
    public_id: string;
    secure_url: string;
    folder_id?: string;
  };
  is_deleted?: boolean;
  parent_id?: Types.ObjectId | ICategory;
  children_id?: Types.ObjectId[] | ICategory[];
  created_by?: Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
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
      required: [true, "description is required"],
      minlength: 10,
    },
    image: {
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
    is_deleted: {
      type: Boolean,
      default: false,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    children_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null,
      },
    ],
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

categorySchema.pre<ICategory>("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.virtual("parentDetails", {
  ref: "Category",
  localField: "parent_id",
  foreignField: "_id",
  justOne: true,
});
categorySchema.virtual("childrenList", {
  ref: "Category",
  localField: "children_id",
  foreignField: "_id",
});

categorySchema.pre("find", function () {
  this.where({ is_deleted: false });
});

export const Category = model<ICategory>("Category", categorySchema);
