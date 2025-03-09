import express from "express";
import cors from "cors";

import { stripeWebhookHandler } from "./controllers/payment";
import { Middlewares } from "./middlewares";
import { appRoutes } from "./routes";
import "./types/custom-definition";
import { env } from "./config/env";

export const app = express();

app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

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
