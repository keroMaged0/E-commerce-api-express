import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Category } from "../../models/category.model";

export const getCategoriesHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const categories = await Category.findActive().populate([
    {
      path: "children_id",
      select: "name",
    },
    {
      path: "parent_id",
      select: "name",
    },
  ]);

  res.json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
};
