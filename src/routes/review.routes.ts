import { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/reviews/index";
import * as val from "../validators/reviews.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(Guards.isauthenticated, handlers.getReviewsHandler)
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.addReview),
    handlers.addReviewHandler
  );

router
  .route("/:id")
  .get(
    Guards.isauthenticated,
    validator(val.paramsVal),
    handlers.getReviewByIdHandler
  )
  .put(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.updateReview),
    handlers.updateReviewHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.deleteReviewHandler
  );

export const reviewsRoutes = router;
