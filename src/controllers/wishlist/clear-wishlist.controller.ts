import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { Wishlist } from "../../models/wishlist.model";
import { logger } from "../../config/winston";

export const clearwishlistHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  const { user_id } = req.loggedUser;
  try {
    await Wishlist.findOneAndUpdate({ user_id }, { products: [] });

    res.json({
      success: true,
      message: "Wishlist cleared successfully",
      data: {},
    });
  } catch (error) {
    next(error);
    logger.error(error);
  }
};
