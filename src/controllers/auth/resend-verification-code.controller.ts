import { ErrorCodes } from "../../types/errors-code.type";
import { User } from "../../models/user.model";
import { env } from "../../config/env";
import { Errors } from "../../errors";
import { Utils } from "../../utils";

export const resendVerificationCodeHandler = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return next(new Errors.BadRequest(ErrorCodes.EMAIL_ALREADY_EXISTS));

  const currentTime = Date.now();
  const expireTime = new Date(user.verification_expire_at || "0").getTime();
  const remainingTimeToResendInSec = Math.floor(
    (expireTime - currentTime) / 1000
  );

  if (!user.verification_reason)
    return next(new Errors.BadRequest(ErrorCodes.NO_REASON_TO_RESEND_CODE));

  if (currentTime < expireTime) {
    return res.status(200).json({
      status: false,
      message: "You have to wait before sending the code again",
      data: {
        remainingTime: remainingTimeToResendInSec,
      },
    });
  }

  const expireAt = new Date(Date.now() + 10 * 60 * 1000);
  const code = await Utils.Crypto.generateCode(3);

  user.verification_code = code;
  user.verification_expire_at = expireAt;
  await user.save();

  // Send email verification
  await Utils.mailTransporter.sendMail({
    from: env.sendEmail.auth.user as string,
    to: email,
    subject: "Email Verification",
    html: `<h1>Your verification code is: ${code}</h1>`,
  });

  res.status(201).json({
    success: true,
    message: "Verification code sent successfully",
    data: {},
  });
};
