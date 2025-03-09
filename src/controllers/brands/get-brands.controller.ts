import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ApiFeature } from "../../utils/api-feature";
import { Brand } from "../../models/brand.model";
import { logger } from "../../config/winston";

export const getBrandsHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const apiFeature = new ApiFeature(Brand.find(), req.query)
      .paginate()
      .search();

    const brands = await apiFeature.query;

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
