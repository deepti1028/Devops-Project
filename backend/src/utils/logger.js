import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

const __dirname = path.resolve();
const { createLogger, format, level, transports } = winston;

const { combine, timestamp, json, printf, colorize, errors } = format;
const env = process.env.NODE_ENV || "development";

const consoleLogFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  consoleLogFormat
);

const prodFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  json()
);

const logger = createLogger({
  level: env === "development" ? "debug" : "info",
  format: env === "development" ? devFormat : prodFormat,
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      dirname: path.join(path.resolve(), "logs"),
      filename: "%DATE%-app.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d",
      maxSize: "20m",
      level: "info",
    }),
  ],
});

export default logger;
