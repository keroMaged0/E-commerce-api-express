import { RequestHandler } from "express";

import {
  IShippingAddress,
  Order,
  PaymentMethod,
} from "../../models/order.model";
import { calculateOrderValues } from "../../services/order.service";
import { SuccessResponse } from "../../types/responses.type";
import { Cart } from "../../models/cart.model";
import { logger } from "../../config/winston";

interface OrderResponseBody {
  shipping_address: IShippingAddress;
  payment_method: PaymentMethod;
  coupon_id: string;
}

export const addOrderHandler: RequestHandler<
  unknown,
  SuccessResponse,
  OrderResponseBody
> = async (req, res, next) => {
  const { shipping_address, payment_method, coupon_id } = req.body;
  const userId = req.loggedUser.user_id;

  try {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart?.items.length) {
      res.status(400).json({
        success: false,
        message: "Cart is empty",
        data: {},
      });
      return;
    }

    const { tax_price, shipping_price, total_price, couponObjectId } =
      calculateOrderValues(cart, coupon_id);

    const orderItems = cart.items.map((item) => item.product._id);

    const order = new Order({
      order_items: orderItems,
      user_id: userId,
      shipping_address,
      payment_method,
      tax_price,
      shipping_price,
      total_price,
      coupon_id: couponObjectId,
    });
    await order.save();

    cart.items = [];
    cart.total_items = 0;
    cart.sub_total = 0;
    cart.total_price_after_discount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order added successfully",
      data: order,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
