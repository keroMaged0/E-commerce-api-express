import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Validation } from "../errors/validation-error";

type RequestKeys = "query" | "body" | "params" | "headers";

interface ISchema {
  [key: string]: Joi.Schema;
}

export const validator = (schema: ISchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let validationErrorArr: string[] = [];

    // Loop through the request keys and validate each part
    for (const key of ["query", "body", "params", "headers"] as RequestKeys[]) {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });

        if (error) {
          validationErrorArr.push(
            ...error.details.map((detail) => detail.message)
          );
        }
      }
    }

    if (validationErrorArr.length > 0)
      return next(
        new Validation(`Validation failed: ${validationErrorArr.join(", ")}`)
      );

    next();
  };
};
