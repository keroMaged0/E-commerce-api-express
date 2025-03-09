import express from "express";
import cors from "cors";

import { Middlewares } from "./middlewares";
import { stripe } from "./config/stripe";
import { appRoutes } from "./routes";
import "./types/custom-definition";
import { env } from "./config/env";
import { logger } from "./config/winston";

export const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = env.payment.stripe.stripeWebhookSecret!;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, "whsec_8ncVcq6tmwy3tVUk7BwoDCkMuvvGaipq");

    console.log("✅ Webhook received:", event);
    if (event.type === "payment_intent.succeeded") {
      logger.info(`Payment  succeeded.`);
    } else {
      logger.info(`Payment  failed.`);
    }

    res.status(200).send("Received!");
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    res.status(400).send(`Webhook Error: ${err}`);
  }
});

app.use(cors({ origin: env.frontUrl }));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(Middlewares.authentication);

app.get("/", (req, res) => {
  res.send("API is working!");
});
app.get("/success", (req, res) => {
  const sessionId = req.query.session_id;
  if (!sessionId) {
    res.status(400).json({ message: "session_id is required" });
  }
  res.json({
    success: true,
    message: `Payment Successful! Session ID: ${sessionId}`,
  });
});

app.use("/api/v1", appRoutes);

app.use("*", Middlewares.routeNotFound);
app.use(Middlewares.errorHandler);
