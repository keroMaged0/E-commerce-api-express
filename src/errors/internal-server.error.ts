import { ErrorCodes } from "../types/errors-code.type";
import { ErrorResponse } from "../types/responses.type";
import { AppError } from "./app-error.error";

export class internalServerError extends AppError {
  statusCode = 500;
  errorCode = ErrorCodes.INTERNAL_SERVER_ERROR;

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
