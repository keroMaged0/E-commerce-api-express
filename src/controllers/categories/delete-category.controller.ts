import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Category } from "../../models/category.model";
import { Errors } from "../../errors";

export const deleteCategoryHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.loggedUser;

  const category = await Category.findOne({
    _id: id,
    created_by: user_id,
    is_deleted: false,
    
  });
  if (!category)
    return next(new Errors.BadRequest(ErrorCodes.CATEGORY_NOT_FOUND));

  if ((category?.children_id?.length ?? 0) > 0)
    return next(new Errors.BadRequest(ErrorCodes.CATEGORY_HAS_CHILDREN));

  if (category.parent_id) {
    await Category.findByIdAndUpdate(category.parent_id, {
      $pull: { children_id: id },
    });
  }

  await Category.findByIdAndUpdate(id, { is_deleted: true });

  res.json({
    message: "Category deleted successfully",
    success: true,
    data: {},
  });
};
