import DailyRotateFile from "winston-daily-rotate-file";
import winston from "winston";
import path from "path";
import fs from "fs";

const logDirectory = "/tmp/logs";

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.simple(),
    winston.format.printf((info: any) => {
      if (info.stack) {
        return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}\n${info.stack}`;
      }
      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
  ),

  transports: [
    new winston.transports.Console(),

    new DailyRotateFile({
      filename: path.join(logDirectory, "logfile-%DATE%.log"), 
      datePattern: "YYYY-MM-DD",
      zippedArchive: false,
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});
