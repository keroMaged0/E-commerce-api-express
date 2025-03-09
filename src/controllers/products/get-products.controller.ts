import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Product } from "../../models/product.model";
import { ApiFeature } from "../../utils/api-feature";
import { logger } from "../../config/winston";

export const getProductsHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const apiFeature = new ApiFeature(Product.find(), req.query)
      .paginate()
      .search();

    const products = await apiFeature.query.populate([
      { path: "brand_id", select: "name" },
      { path: "category_id", select: "name" },
      { path: "reviews", select: "-_id user rating comment" },
    ]);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
