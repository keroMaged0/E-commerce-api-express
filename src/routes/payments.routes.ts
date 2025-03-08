import express, { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/payment/index";
import * as val from "../validators/payment.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/initiate")
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.initiatePayment),
    handlers.initiatePaymentHandler
  );

router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  handlers.stripeWebhookHandler
);

router.get("/success", (req, res) => {
  const sessionId = req.query.session_id;
  if (!sessionId) {
    res.status(400).json({ message: "session_id is required" });
  }
  res.json({
    success: true,
    message: `Payment Successful! Session ID: ${sessionId}`,
  });
});

router.get("/cancel", (req, res) => {
  res.send("cancel");
});

export const paymentsRoutes = router;
