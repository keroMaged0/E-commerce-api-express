import { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/coupons/index";
import * as val from "../validators/coupons.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(Guards.isauthenticated, handlers.getCouponsHandler)
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.createCoupon),
    handlers.addCouponHandler
  );

router
  .route("/:id")
  .get(
    Guards.isauthenticated,
    validator(val.paramsVal),
    handlers.getCouponByIdHandler
  )
  .put(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.updateCoupon),
    handlers.updateCouponHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.deleteCouponHandler
  );

export const couponsRoutes = router;
