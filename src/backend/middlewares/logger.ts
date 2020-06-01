import { createLogger, format, transports } from 'winston';
import { Request, Response } from 'express';

export function logger(req: Request, res: Response, next: Function): void {
  const logger = createLogger({
    level: "info",
    format: format.json(),
    transports: [
      new transports.File({ filename: process.env.LOG_FILE })
    ]
  });

  req.logger = logger;
  next();
}