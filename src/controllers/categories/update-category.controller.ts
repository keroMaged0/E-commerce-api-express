import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Category } from "../../models/category.model";
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

    parentCategory.children_id?.push(parent_id as any);
    await parentCategory.save();
  }

  category.name = name || category.name;
  category.description = description || category.description;
  category.image_url = image_url || category.image_url;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
};
