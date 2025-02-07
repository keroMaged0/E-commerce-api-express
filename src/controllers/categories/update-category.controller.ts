import { RequestHandler } from "express";

import { updateImage, uploadImageToCloudinary } from "../../utils/upload-media";
import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Category } from "../../models/category.model";
import { env } from "../../config/env";
import { Errors } from "../../errors";

export const updateCategoryHandler: RequestHandler<
  { id: string },
  SuccessResponse,
  {
    name?: string;
    description?: string;
    image_url?: string;
    parent_id?: string;
  }
> = async (req, res, next) => {
  const { name, description, image_url, parent_id } = req.body;
  const { user_id } = req.loggedUser;
  const { id } = req.params;

  const category = await Category.findOne({
    _id: id,
    is_deleted: false,
  });
  if (!category) return next(new Errors.BadRequest(ErrorCodes.NOT_FOUND));

  if (category.created_by?.toString() !== user_id.toString())
    return next(new Errors.Unauthorized(ErrorCodes.UNAUTHORIZED));

  if (parent_id) {
    const parentCategory = await Category.findById(parent_id);
    if (!parentCategory)
      return next(new Errors.BadRequest(ErrorCodes.CATEGORY_NOT_FOUND));

    parentCategory.children_id = parentCategory.children_id || [];
    parentCategory.children_id?.push(parent_id as any);
    await parentCategory.save();
  }

  if (req?.file) {
    if (!category.folder_id) {
      let uploadResult = await uploadImageToCloudinary(
        req.file,
        env.mediaStorage.cloudinary.images.category
      );
      if (!uploadResult)
        return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));

      category.image_url = {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
      category.folder_id = uploadResult.folderId;
    } else {
      const oldPublicId = category.image_url?.public_id;
      const updatedSecureUrl = await updateImage(oldPublicId, req.file);
      if (!updatedSecureUrl)
        return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));

      category.image_url = {
        secure_url: updatedSecureUrl,
        public_id: oldPublicId as string,
      };
    }
  }

  category.name = name || category.name;

  category.description = description || category.description;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
};
