import { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/wishlist/index";
import * as val from "../validators/wishlist.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    handlers.getwishlistHandler
  )
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.addToWishlist),
    handlers.addToWishlistHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    handlers.clearwishlistHandler
  );

router
  .route("/:product_id")
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.removeItemFromWishlistHandler
  );

export const wishlistRoutes = router;
