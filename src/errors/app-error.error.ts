import {
  ValidationErrorResponse,
  ErrorResponse,
} from "../types/responses.type";

export abstract class AppError extends Error {
  abstract statusCode: number;
  abstract errorCode: string;

  constructor(message: string) {
    super(message);
  }
  abstract serializeError(): ErrorResponse | ValidationErrorResponse;
}
