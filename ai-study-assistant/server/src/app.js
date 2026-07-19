import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import studyRoutes from "./routes/study.routes.js";

const app = express();

// CORS locked to the known client origin rather than "*" — this is a
// backend that holds a paid API key behind it, so open CORS would let any
// website's frontend JS call it and burn through the Gemini quota.
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "10kb" })); // small limit — this API only ever accepts a short topic string
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", studyRoutes);

// 404 for anything unmatched
app.use((req, res) => {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Route not found." },
  });
});

// Must be registered last — Express identifies error middleware by its
// four-argument signature, and only calls it when next(err) is invoked.
app.use(errorHandler);

export default app;
