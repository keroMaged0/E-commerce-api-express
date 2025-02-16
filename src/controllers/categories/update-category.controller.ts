import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { updateImage } from "../../utils/upload-media";
import { Category } from "../../models/category.model";
import { Errors } from "../../errors";

export const updateCategoryHandler: RequestHandler<
  { id: string },
  SuccessResponse,
  {
    name?: string;
    description?: string;
    oldPublicId?: string;
    parent_id?: string;
  }
> = async (req, res, next) => {
  const { name, description, oldPublicId, parent_id } = req.body;
  const { user_id } = req.loggedUser;
  const { id } = req.params;

  const category = await Category.findByIdActive(id as any);
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

  if (oldPublicId) {
    if (!req.file) return next(new Errors.BadRequest(ErrorCodes.FILE_REQUIRED));

    const updatedSecureUrl = await updateImage(
      oldPublicId,
      category.image?.folder_id as string,
      req.file
    );
    if (!updatedSecureUrl)
      return next(new Errors.BadRequest(ErrorCodes.CLOUDINARY_ERROR));

    category.image = {
      secure_url: updatedSecureUrl,
      public_id: oldPublicId,
      folder_id: category.image?.folder_id as string,
    };
  }
  category.name = name || category.name;

  category.description = description || category.description;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: {},
  });
};
