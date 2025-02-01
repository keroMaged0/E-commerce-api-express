import { Router } from "express";

import { categoriesRoutes } from "./categories.routes";
import { authRoutes } from "./auth.routes";

const app = Router();

app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);

export const appRoutes = app;
