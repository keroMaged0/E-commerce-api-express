import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Category } from "../../models/category.model";
import { Errors } from "../../errors";

export const getCategoryByIdHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate([
    { path: "children_id", select: "name" },
    { path: "parent_id", select: "name" },
  ]);
  if (!category)
    return next(new Errors.NotFoundError(ErrorCodes.CATEGORY_NOT_FOUND));

  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
};
