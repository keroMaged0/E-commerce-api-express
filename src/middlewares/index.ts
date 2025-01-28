import { authentication } from "./authentication.middleware";
import { errorHandler } from "./error-handling.middlewares";
import { routeNotFound } from "./route-not-found.middlewares";

export const Middlewares = { routeNotFound, errorHandler,authentication };
