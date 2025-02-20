import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";

import { logger } from "../../config/winston";

export const updateCouponHandler: RequestHandler<
  unknown,
  SuccessResponse,
  {}
> = async (req, res, next) => {
  try {
  } catch (error) {
    next();
    logger.error(error);
  }
};
