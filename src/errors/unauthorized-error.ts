import { ErrorCodes } from "../types/errors-code.type";
import { ErrorResponse } from "../types/responses.type";
import { AppError } from "./app-error.error";

export class Unauthorized extends AppError {
  statusCode = 401;
  errorCode = ErrorCodes.UNAUTHORIZED;

  constructor(message: string = "Unauthorized") {
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
