import { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/payment/index";
import * as val from "../validators/payment.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/initiate")
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.initiatePayment),
    handlers.initiatePaymentHandler
  );

router
  .route("/")
  .get(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    handlers.getPaymentsHandler
  );

router
  .route("/:id")
  .get(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    handlers.getPaymentByIdHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    handlers.cancelPaymentHandler
  );

export const paymentsRoutes = router;
