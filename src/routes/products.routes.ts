import { Router } from "express";

import { uploadMemoryStorage } from "../middlewares/upload-files.middleware";
import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/products/index";
import * as val from "../validators/products.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(Guards.isauthenticated, handlers.getProductsHandler)
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().array("images", 3),
    validator(val.createProduct),
    handlers.createProductHandler
  );

router
  .route("/:id")
  .get(
    Guards.isauthenticated,
    validator(val.paramsVal),
    handlers.getProductByIdHandler
  )
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().array("images"),
    validator(val.paramsVal),
    handlers.addImagesToProductHandler
  )
  .put(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().single("image"),
    validator(val.updateProduct),
    handlers.updateProductHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.deleteProductHandler
  );

export const productsRoutes = router;
