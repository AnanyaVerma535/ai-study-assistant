import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createStudyMaterial } from "../controllers/study.controller.js";

const router = Router();

// Scoped to this route only (not the whole app) since it's the one endpoint
// that actually costs money (Gemini calls) and can be slow — other routes,
// if added later (health checks etc.), shouldn't share this budget.
const studyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 generations per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait a moment and try again.",
    },
  },
});

router.post("/study", studyRateLimiter, createStudyMaterial);

export default router;
