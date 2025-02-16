import { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/cart/index";
import * as val from "../validators/cart.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(Guards.isauthenticated, handlers.getCartsHandler)
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.createCart),
    handlers.addCartHandler
  );

router
  .route("/:id")
  .get(
    Guards.isauthenticated,
    validator(val.paramsVal),
    handlers.getCartByIdHandler
  )
  .put(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.updateCart),
    handlers.updateCartHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.deleteCartHandler
  );

export const CartsRoutes = router;
