import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { ErrorCodes } from "../../types/errors-code.type";
import { logger } from "../../config/winston";
import { Cart } from "../../models/cart.model";
import { Errors } from "../../errors";

export const removeItemFromCartHandler: RequestHandler<
  { product_id: string },
  SuccessResponse,
  unknown
> = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const userId = req.loggedUser.user_id;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return next(new Errors.BadRequest(ErrorCodes.CART_NOT_FOUND));

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product_id
    );
    if (itemIndex === -1)
      return next(new Errors.BadRequest(ErrorCodes.ITEM_NOT_FOUND));

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: {},
    });
  } catch (error) {
    next();
    logger.error(error);
  }
};
