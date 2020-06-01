import { Connection } from "typeorm";
import { Logger } from "winston";

declare global {
  namespace Express {
    export interface Request {
      db: Connection;
      logger: Logger
    }
  }
}