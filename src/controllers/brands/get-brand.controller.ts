import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Product } from "../../models/product.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";
import { Brand } from "../../models/brand.model";

export const getBrandByIdHandler: RequestHandler<
  {
    id: string;
  },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return next(new Errors.NotFoundError(ErrorCodes.BRAND_NOT_FOUND));
    }
    res.status(200).json({
      success: true,
      message: "Brand retrieved successfully",
      data: brand,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
