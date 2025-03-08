import { logger } from "../config/winston";
import { stripe } from "../config/stripe";
import { env } from "../config/env";

interface PaymentParams {
  amount: number;
  paymentId: string;
  userId: string;
  productName: string;
}

export class PaymentGateway {
  static async createPayment(params: PaymentParams) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "EGP",
              unit_amount: params.amount * 100,
              product_data: {
                name: params.productName,
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.frontUrl}/success?session_id={{CHECKOUT_SESSION_ID}}`,
        cancel_url: `${env.frontUrl}/cancel`,
        client_reference_id: params.paymentId,
        metadata: {
          paymentId: params.paymentId,
          userId: params.userId,
        },
      });
      return {
        session,
        sessionId: session.id,
      };
    } catch (error: any) {
      logger.error(error.message);
      throw new Error(error.message);
    }
  }
}
