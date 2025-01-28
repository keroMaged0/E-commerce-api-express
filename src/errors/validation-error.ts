import { ErrorCodes } from "../types/errors-code.type";
import { AppError } from "./app-error.error";

export class Validation extends AppError {
  statusCode = 422;
  errorCode = ErrorCodes.VALIDATION_ERROR;

  constructor(message: string) {
    super(message);
  }

  serializeError(): any {
    return {
      success: false,
      errorCode: this.errorCode,
      message: this.message,
      data: {},
    };
  }
}
