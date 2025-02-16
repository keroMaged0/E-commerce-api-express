import { Router } from "express";

import { uploadMemoryStorage } from "../middlewares/upload-files.middleware";
import { validator } from "../middlewares/validator.middleware";
import * as handlers from "../controllers/categories/index";
import * as val from "../validators/categories.validator";
import { PERMISSIONS } from "../types/permissions";
import { Guards } from "../guards";

const router = Router();

router
  .route("/")
  .get(Guards.isauthenticated, handlers.getCategoriesHandler)
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().single("image"),
    validator(val.createCategory),
    handlers.createCategoryHandler
  );

router
  .route("/:id")
  .get(
    Guards.isauthenticated,
    validator(val.paramsVal),
    handlers.getCategoryByIdHandler
  )
  .put(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().single("image"),
    validator(val.updateCategory),
    handlers.updateCategoryHandler
  )
  .delete(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    validator(val.paramsVal),
    handlers.deleteCategoryHandler
  )
  .post(
    Guards.isauthenticated,
    Guards.isauthorized(PERMISSIONS.ADMIN),
    uploadMemoryStorage().single("image"),
    validator(val.paramsVal),
    handlers.addImageToCategoryHandler
  );

router
  .route("/children/:id")
  .get(
    Guards.isauthenticated,
    validator(val.paramsVal),
    handlers.getChildCategoriesHandler
  );

export const categoriesRoutes = router;
