import express from "express";
import cors from "cors";

import "./types/custom-definition";
import { Middlewares } from "./middlewares";
import { appRoutes } from "./routes";
import { env } from "./config/env";

export const app = express();

app.use(cors({ origin: env.frontUrl }));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(Middlewares.authentication);

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use("/api/v1", appRoutes);

app.use("*", Middlewares.routeNotFound);
app.use(Middlewares.errorHandler);
