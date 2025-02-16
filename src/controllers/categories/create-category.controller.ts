import { RequestHandler } from "express";

import { uploadImageToCloudinary } from "../../utils/upload-media";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Category } from "../../models/category.model";
import { env } from "../../config/env";
import { Errors } from "../../errors";

interface categoryResponseBody {
  name: string;
  description: string;
  slug: string;
  parent_id?: string;
}
export const createCategoryHandler: RequestHandler<
  unknown,
  SuccessResponse,
  categoryResponseBody
> = async (req, res, next) => {
  const { name, description, slug, parent_id } = req.body;
  const { user_id } = req.loggedUser;

  const exsitingCategory = await Category.findOne({ name, is_deleted: false });
  if (exsitingCategory)
    return next(new Errors.BadRequest(ErrorCodes.CATEGORY_ALREADY_EXISTS));

  let finalImageData: {
    secure_url: string;
    public_id: string;
    folderId: string;
  } | null = null;

  if (req.file) {
    const result = await uploadImageToCloudinary(
      req.file,
      env.mediaStorage.cloudinary.images.category
    );
    if (!result?.secure_url || !result.public_id || !result.public_id)
      return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));

    finalImageData = result;
  }

  const category = new Category({
    name,
    description,
    slug,
    image: finalImageData,
    parent_id,
    created_by: user_id,
  });

  if (parent_id) {
    const parentCategory = await Category.findById(parent_id);
    if (!parentCategory)
      return next(new Errors.BadRequest(ErrorCodes.CATEGORY_NOT_FOUND));

    parentCategory.children_id = parentCategory.children_id || [];
    parentCategory.children_id.push(category._id as any);
    await parentCategory.save();
  }

  await category.save();

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
};
