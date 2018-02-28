//handle ENV
import * as dotenv from "dotenv";
if (process.env.NODE_ENV != "production") {
  process.env.NODE_ENV = "development";
  const dotenv = require("dotenv");
  dotenv.config();
} else {
  process.env.PORT = "80";
}

import * as log from "npmlog";

// start app
import app from "./app";
app.listen(process.env.PORT, (err: Error) => {
  if (err) return log.error("", "error on startup", err);

  const message = `listening in ${process.env.NODE_ENV} mode on port ${
    process.env.PORT
  }`;

  log.info("", message);
});

//handle the unhandled and the uncaught
process.on("unhandledRejection", (err, promise) => {
  log.error("", "Unhandled Rejection at " + promise, err);
});

process.on("uncaughtException", err => {
  log.error("", "Uncaught Exception: " + err.message, err);
  process.exit(1);
});
