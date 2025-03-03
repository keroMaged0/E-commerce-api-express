import { RequestHandler } from "express";

import { SuccessResponse } from "../../types/responses.type";
import { logger } from "../../config/winston";

interface initiateResponseBody {
  orderId: string;
  paymentMethod: string;
}

export const initiatePaymentHandler: RequestHandler<
  unknown,
  SuccessResponse,
  initiateResponseBody
> = async (req, res, next) => {
  const { orderId, paymentMethod } = req.body;
  const { user_id } = req.loggedUser;

  

  try {
    res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: {},
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
