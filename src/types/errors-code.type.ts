export enum ErrorCodes {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  INVALID_CREDINTIALS = "INVALID_CREDINTIALS ",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  USER_NOT_VERIFIED = "USER_NOT_VERIFIED",
  NO_REASON_TO_RESEND_CODE = "NO_REASON_TO_RESEND_CODE",
  UNAUTHENTICATED = "UNAUTHENTICATED",
  INVALID_TOKEN = "INVALID_TOKEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_VERIFICATION_CODE = "INVALID_VERIFICATION_CODE",
}

export const ErrorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.BAD_REQUEST]: "Bad Request",
  [ErrorCodes.NOT_FOUND]: "Not Found",
  [ErrorCodes.INTERNAL_ERROR]: "Internal Server Error",
  [ErrorCodes.INVALID_CREDINTIALS]: "Invalid Credintials",
  [ErrorCodes.EMAIL_ALREADY_EXISTS]: "Email Already Exists",
  [ErrorCodes.USER_NOT_VERIFIED]: "User Not Verified",
  [ErrorCodes.NO_REASON_TO_RESEND_CODE]: "No Reason To Resend Code",
  [ErrorCodes.UNAUTHENTICATED]: "Unauthenticated",
  [ErrorCodes.INVALID_TOKEN]: "Invalid Token",
  [ErrorCodes.VALIDATION_ERROR]: "Validation Error",
  [ErrorCodes.INVALID_VERIFICATION_CODE]: "Invalid Verification Code",
};

