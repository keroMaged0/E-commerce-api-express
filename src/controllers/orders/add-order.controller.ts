import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { logger } from "../../config/winston";
import { IShippingAddress, Order, PaymentMethod } from "../../models/order.model";
import { Cart } from "../../models/cart.model";

interface OrderResponseBody {
  shipping_address: IShippingAddress;
  payment_method: PaymentMethod;
}

export const addOrderHandler: RequestHandler<
  unknown,
  SuccessResponse,
  OrderResponseBody
> = async (req, res, next) => {
  try {
    const { shipping_address, payment_method } = req.body;
    const userId = req.loggedUser.user_id;

    const cart = await Cart.findOne({ user_id: userId }).populate("cart_items.product_id");

    // Create order
    const order = await Order.create({
      user_id: userId,
      shipping_address,
      payment_method,
      order_items: ,
    });

  } catch (error) {
    next();
    logger.error(error);
  }
};
