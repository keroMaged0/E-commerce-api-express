import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { Cart } from "../../models/cart.model";
import { logger } from "../../config/winston";
import { Errors } from "../../errors";

export const clearCartHandler: RequestHandler<
  unknown,
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const userId = req.loggedUser.user_id;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return next(new Errors.BadRequest(ErrorCodes.CART_NOT_FOUND));

    if (cart.items.length === 0)
      return next(new Errors.BadRequest(ErrorCodes.CART_IS_EMPTY));
    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: {},
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
