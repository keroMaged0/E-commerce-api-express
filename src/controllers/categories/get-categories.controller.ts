import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Category } from "../../models/category.model";
import { getCache, setCache } from "../../utils/cache";
import { ApiFeature } from "../../utils/api-feature";
import { env } from "../../config/env";

export const getCategoriesHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  // Check if cache exists
  const cachedCategories = await getCache(env.cacheKeys.categories);
  if (cachedCategories)
    res.json({
      success: true,
      message: "Categories fetched successfully from cache",
      data: cachedCategories,
    });

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

  // Set cache
  await setCache(env.cacheKeys.categories, categories, 3600);

  res.json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
};
