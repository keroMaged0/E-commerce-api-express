import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Category } from "../../models/category.model";
import { Errors } from "../../errors";

export const getChildCategoriesHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdActive(id as any).populate({
    path: "children_id",
    select: "-parent_id",
  });
  if (!category)
    return next(new Errors.NotFoundError(ErrorCodes.CATEGORY_NOT_FOUND));

  const childCategories = category.children_id;

  res.status(200).json({
    success: true,
    message: "Child categories retrieved successfully",
    data: childCategories,
  });
};
