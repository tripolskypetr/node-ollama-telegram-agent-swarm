import { connect } from "mongoose";

import { CC_MONGO_CONNECTION_STRING } from "src/config/params";
import { inject } from "src/lib/core/di";
import LoggerService from "./LoggerService";
import TYPES from "src/lib/core/types";
import { errorData } from "functools-kit";

export class MongooseService {
  readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  init = async () => {
    const mongoose = await connect(CC_MONGO_CONNECTION_STRING);
    this.loggerService.log("mongooseService init complete");

    mongoose.connection.on("connected", () => {
      this.loggerService.log("mongooseService Mongo connected to the database");
    });

    mongoose.connection.on("error", (err) => {
      this.loggerService.log("mongooseService Mongo error", {
        error: errorData(err),
      });
      throw new class extends Error {
        constructor() {
            super("mongooseService Mongo error")
        }
        originalError = errorData(err);
      }
    });

    mongoose.connection.on("disconnected", () => {
      this.loggerService.log("mongooseService disconnected from the database.");
    });

    mongoose.connection.on("reconnected", () => {
      this.loggerService.log("mongooseService reconnected to the database.");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
    });
  };
}

export default MongooseService;
