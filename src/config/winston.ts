import winston from "winston";
import { LogtailTransport } from "@logtail/winston";
import { Logtail } from "@logtail/node";
import { env } from "./env";

const { combine, timestamp, errors, printf } = winston.format;

const logtail = new Logtail(env.winston.sourceToken);

export const logger = winston.createLogger({
  format: combine(
    timestamp(),
    errors({ stack: true }),
    printf((info: any) => {
      if (info.stack) {
        return `${info.timestamp} [${info.level.toUpperCase()}]: ${
          info.message
        }\n${info.stack}`;
      }
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
  ),
  transports: [new winston.transports.Console(), new LogtailTransport(logtail)],
});
