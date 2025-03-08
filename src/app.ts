import express from "express";
import cors from "cors";

import "./types/custom-definition";
import { Middlewares } from "./middlewares";
import { appRoutes } from "./routes";
import { env } from "./config/env";
import { stripeWebhookHandler } from "./controllers/payment";

export const app = express();

app.use(cors({ origin: env.frontUrl }));

app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

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

app.get("/cancel", (req, res) => {
  res.send("cancel");
});

app.use("/api/v1", appRoutes);

app.use("*", Middlewares.routeNotFound);
app.use(Middlewares.errorHandler);
