import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Category } from "../../models/category.model";
import { ApiFeature } from "../../utils/api-feature";

export const getCategoriesHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const apiFeature = new ApiFeature(Category.find(), req.query)
    .paginate()
    .search();

  const categories = await apiFeature.query.populate([
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
