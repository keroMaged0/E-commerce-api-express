import { isauthenticated } from "./isauthenticated.guard";
import { isauthorized } from "./isauthorized.guard";

export const Guards = {
  isauthorized,
  isauthenticated,
};
