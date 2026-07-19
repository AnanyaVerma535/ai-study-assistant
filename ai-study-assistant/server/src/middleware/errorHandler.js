import { env } from "../config/env.js";

/**
 * Last-resort error handler. Anything that reaches here is unexpected —
 * every known failure mode (timeout, malformed JSON, upstream errors) is
 * already caught and responded to inside study.controller.js. This exists
 * purely as a safety net so an uncaught exception never crashes the process
 * or leaks internals (stack traces, file paths) to the client.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong on our end. Please try again.",
      // Stack traces only in development — never in production responses
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
}
