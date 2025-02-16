import { Router } from "express";

import { uploadMemoryStorage } from "../middlewares/upload-files.middleware";
import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/brands/index";
import * as val from "../validators/brand.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(Guards.isauthenticated, handlers.getBrandsHandler)
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().single("logo"),
    validator(val.createBrand),
    handlers.createBrandHandler
  );

router
  .route("/:id")
  .get(
    Guards.isauthenticated,
    validator(val.paramsVal),
    handlers.getBrandByIdHandler
  )
  .put(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().single("logo"),
    validator(val.updateBrand),
    handlers.updateBrandHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.deleteBrandHandler
  )
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().single("logo"),
    validator(val.paramsVal),
    handlers.addImageToBrandHandler
  )


export const brandsRoutes = router;
