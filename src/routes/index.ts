import { Router } from "express";

import { categoriesRoutes } from "./categories.routes";
import { productsRoutes } from "./products.routes";
import { paymentsRoutes } from "./payments.routes";
import { reviewsRoutes } from "./review.routes";
import { couponRoutes } from "./coupon.routes";
import { brandsRoutes } from "./brands.routes";
import { ordersRoutes } from "./order.routes";
import { cartsRoutes } from "./cart.routes";
import { authRoutes } from "./auth.routes";

const app = Router();

app.get("/success/:session_id", (req, res) => {
  res.send("success");
});

app.get("/cancel", (req, res) => {
  res.send("cancel");
});

app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/products", productsRoutes);
app.use("/brands", brandsRoutes);
app.use("/carts", cartsRoutes);
app.use("/orders", ordersRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/coupons", couponRoutes);
app.use("/payments", paymentsRoutes);

export const appRoutes = app;
