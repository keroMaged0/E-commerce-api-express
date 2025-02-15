import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { logger } from "../../config/winston";
import { Brand } from "../../models/brand.model";

export const getBrandsHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const brands = await Brand.find();

    res.status(200).json({
      success: true,
      message: "Brands retrieved successfully",
      data: brands,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
