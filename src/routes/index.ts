import { Router } from "express";

import { authRoutes } from "./auth.routes";

const app = Router();

app.use("/auth", authRoutes);

export const appRoutes = app;
