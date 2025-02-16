import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Product } from "../../models/product.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const getProductByIdHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).populate([
      { path: "brand_id" },
      { path: "category_id" },
      { path: "reviews" },
    ]);
    if (!product)
      return next(new Errors.NotFoundError(ErrorCodes.PRODUCT_NOT_FOUND));

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
