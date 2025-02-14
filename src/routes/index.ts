import { Router } from "express";

import { categoriesRoutes } from "./categories.routes";
import { productsRoutes } from "./products.routes";
import { authRoutes } from "./auth.routes";

const app = Router();

app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/products", productsRoutes);

export const appRoutes = app;
