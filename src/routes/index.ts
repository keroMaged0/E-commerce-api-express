import { Router } from "express";

import { categoriesRoutes } from "./categories.routes";
import { productsRoutes } from "./products.routes";
import { brandsRoutes } from "./brands.routes";
import { ordersRoutes } from "./order.routes";
import { authRoutes } from "./auth.routes";
import { cartsRoutes } from "./cart.routes";

const app = Router();

app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/products", productsRoutes);
app.use("/brands", brandsRoutes);
app.use("/carts", cartsRoutes);
app.use("/orders", ordersRoutes);

export const appRoutes = app;
