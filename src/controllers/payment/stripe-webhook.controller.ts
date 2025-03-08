import { Request, Response } from "express";

import { Payment, PaymentStatus } from "../../models/payment.model";
import { Order } from "../../models/order.model";
import { logger } from "../../config/winston";
import { stripe } from "../../config/stripe";
import { env } from "../../config/env";

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = env.payment.stripe.stripeWebhookSecret;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      webhookSecret
    );
  } catch (error: any) {
    logger.error("Webhook Error: " + error.message);
    res.status(400).send("Webhook Error: " + error.message);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as any;
      const paymentId = session.client_reference_id;
      const orderId = session.metadata?.orderId;
      try {
        await Payment.findByIdAndUpdate(paymentId, {
          payment_status: PaymentStatus.COMPLETED,
        });
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, { is_paid: true });
        }
        logger.info(`Payment ${paymentId} succeeded.`);
      } catch (error: any) {
        logger.error(`Error updating payment ${paymentId}: ${error.message}`);
        res.status(500).send("Internal Server Error");
        return;
      }
      break;

    default:
      logger.info(`Unhandled event type ${event.type}`);
  }

  console.log("====================================");
  console.log(sig);
  console.log("====================================");
  console.log(event);

  res.status(200).json({ received: true });
};
