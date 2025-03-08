import { Payment, PaymentStatus } from "../../models/payment.model";
import { Order } from "../../models/order.model";
import { logger } from "../../config/winston";
import { stripe } from "../../config/stripe";
import { env } from "../../config/env";

export const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      logger.error("Missing Stripe signature");
      return res.status(400).send("Missing Stripe signature");
    }
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        env.payment.stripe.stripeWebhookSecret
      );
    } catch (error: any) {
      logger.error("Webhook Error: " + error.message);
      res.status(400).send("Webhook Error: " + error.message);
      return;
    }

    if (!event) {
      logger.error("Webhook Error: Event is undefined.");
      res.status(400).send("Webhook Error: Event is undefined.");
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
  } catch (error) {
    logger.error("Error in handleStripeWebhook", error);
    throw error;
  }
};
