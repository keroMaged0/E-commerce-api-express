import { Router } from "express";

import { validator } from "../middlewares/validator.middleware";
import { authValidators } from "../validators/auth.validator";
import * as handlers from "../controllers/auth/index";

const router = Router();

router.post(
  "/signup",
  validator(authValidators.signup),
  handlers.signupHandler
);

router.post(
  "/signin",
  validator(authValidators.signin),
  handlers.signinHandler
);

router.post(
  "/verify-email",
  validator(authValidators.verification),
  handlers.verifyEmailHandler
);

router.post(
  "/resend-verification-code",
  validator(authValidators.resendVerification),
  handlers.resendVerificationCodeHandler
);

router.post(
  "/refresh-token",
  validator(authValidators.refreshToken),
  handlers.refreshUserToken
);

router.patch(
  "/chang-password",
  validator(authValidators.changePassword),
  handlers.changePassword
);

router
  .route("/forget-password")
  .post(
    validator(authValidators.askForgetPassword),
    handlers.askForgetPasswordHandler
  )
  .patch(
    validator(authValidators.updateForgetenPassword),
    handlers.updateForgetenPasswordHandler
  );

export const authRoutes = router;
