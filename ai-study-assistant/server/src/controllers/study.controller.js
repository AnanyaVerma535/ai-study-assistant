import { generateStudyMaterial, TimeoutError, GeminiUpstreamError } from "../services/gemini.service.js";
import { validateAndRepairStudyData } from "../validators/studyDataValidator.js";

const REASON_TO_STATUS = {
  MALFORMED_JSON: 502,
  INVALID_SCHEMA: 502,
  MISSING_FLASHCARDS: 502,
  MISSING_QUIZ: 502,
};

const VALID_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const VALID_QUIZ_COUNTS = [3, 5, 8, 10];

export async function createStudyMaterial(req, res, next) {
  const { topic, difficulty, quizCount } = req.body;

  if (typeof topic !== "string" || topic.trim().length === 0) {
    return res.status(400).json({
      error: { code: "INVALID_INPUT", message: "Topic is required." },
    });
  }

  if (topic.trim().length > 500) {
    return res.status(400).json({
      error: { code: "TOPIC_TOO_LONG", message: "Topic must be under 500 characters." },
    });
  }

  const safeDifficulty = VALID_DIFFICULTIES.includes(difficulty) ? difficulty : "Intermediate";
  const safeQuizCount = VALID_QUIZ_COUNTS.includes(quizCount) ? quizCount : 5;

  try {
    const rawText = await generateStudyMaterial(topic.trim(), safeDifficulty, safeQuizCount);
    const result = validateAndRepairStudyData(rawText);

    if (!result.valid) {
      return res.status(REASON_TO_STATUS[result.reason] || 502).json({
        error: {
          code: result.reason,
          message: "The AI response could not be understood. Please try again.",
        },
      });
    }

    return res.status(200).json({ data: { ...result.data, difficulty: safeDifficulty } });
  } catch (err) {
    if (err instanceof TimeoutError) {
      return res.status(504).json({
        error: { code: "TIMEOUT", message: "The AI took too long to respond. Please try again." },
      });
    }
    if (err instanceof GeminiUpstreamError) {
      return res.status(err.status).json({
        error: {
          code: err.status === 429 ? "RATE_LIMITED" : "UPSTREAM_ERROR",
          message:
            err.status === 429
              ? "Too many requests. Please wait a moment and try again."
              : "The AI service is temporarily unavailable.",
        },
      });
    }
    return next(err);
  }
}
