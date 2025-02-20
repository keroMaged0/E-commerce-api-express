import { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/orders/index";
import * as val from "../validators/orders.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(Guards.isauthenticated, handlers.getOrdersHandler)
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.addOrder),
    handlers.addOrderHandler
  );

router
  .route("/:order_id")
  .get(
    Guards.isauthenticated,
    validator(val.paramsVal),
    handlers.getOrderByIdHandler
  )
  .put(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.updateOrder),
    handlers.updateOrderHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.cancelOrderHandler
  );

export const ordersRoutes = router;
