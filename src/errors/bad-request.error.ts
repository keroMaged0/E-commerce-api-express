import { ErrorCodes } from "../types/errors-code.type";
import { ErrorResponse } from "../types/responses.type";
import { AppError } from "./app-error.error";

export class BadRequest extends AppError {
  statusCode = 400;
  errorCode = ErrorCodes.BAD_REQUEST;

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
