import { ErrorCodes } from "../types/errors-code.type";
import { ErrorResponse } from "../types/responses.type";
import { AppError } from "./app-error.error";

export class NotFoundError extends AppError {
  statusCode = 404;
  errorCode = ErrorCodes.NOT_FOUND;

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
