import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Product } from "../../models/product.model";
import { logger } from "../../config/winston";

export const getProductsHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const products = await Product.find().populate([
      { path: "brand_id", select: "name" },
      { path: "category_id", select: "name" },
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
