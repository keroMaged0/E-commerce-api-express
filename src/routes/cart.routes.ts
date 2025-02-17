import { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/cart/index";
import * as val from "../validators/cart.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    handlers.getCartHandler
  )
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.addToCart),
    handlers.addToCartHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    handlers.clearCartHandler
  );

router
  .route("/:product_id")
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.removeItemFromCartHandler
  )
  .patch(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.updateQuantity),
    handlers.updateQuantityHandler
  );

export const cartsRoutes = router;
