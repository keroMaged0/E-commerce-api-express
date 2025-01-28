import { ErrorCodes } from "../types/errors-code.type";
import { ErrorResponse } from "../types/responses.type";
import { AppError } from "./app-error.error";

export class Unauthenticated extends AppError {
  statusCode = 401;
  errorCode = ErrorCodes.UNAUTHENTICATED;

  constructor(message: string) {
    super(message);
  }

  serializeError(): ErrorResponse {
    return {
      success: false,
      errorCode: this.errorCode,
      message: this.message,
      data: {},
    };
  }
}
