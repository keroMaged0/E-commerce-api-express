import { Document, model, Model, Schema, Types } from "mongoose";
import slugify from "slugify";

interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  is_deleted?: boolean;
  parent_id?: Types.ObjectId | ICategory;
  children_id?: Types.ObjectId[] | ICategory[];
  created_by?: Types.ObjectId;
}

interface ICategoryModel extends Model<ICategory> {
  findActive(): Promise<ICategory[]>;
}

const categorySchema = new Schema<ICategory, ICategoryModel>(
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
    image_url: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      validate: {
        validator: function (this: ICategory, value: Types.ObjectId) {
          const docId = this._id as Types.ObjectId;
          if (!docId || !value) return false;
          return !docId.equals(value);
        },
        message: "parent category can't be the same as the category itself",
      },
    },
    children_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
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

categorySchema.pre<ICategory>("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.pre("find", function () {
  this.where({ is_deleted: false });
});

export const Category = model<ICategory, ICategoryModel>(
  "Category",
  categorySchema
);
