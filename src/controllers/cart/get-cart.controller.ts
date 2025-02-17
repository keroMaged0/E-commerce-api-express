import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";

import { logger } from "../../config/winston";
import { Cart } from "../../models/cart.model";

export const getCartHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const userId = req.loggedUser.user_id;

    const cart = await Cart.findOne({ user_id: userId }).populate([
      {
        path: "user_id",
        select: "username",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
