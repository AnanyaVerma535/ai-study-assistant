import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert study material generator writing for a student preparing for an exam. You MUST return ONLY valid JSON, no markdown, no code fences, no commentary.

Schema:
{
  "title": string,
  "summary": string,
  "flashcards": [{ "question": string, "answer": string, "hint": string }],
  "quiz": [{ "question": string, "options": [string,string,string,string], "correctAnswer": number, "explanation": string }]
}

Content depth requirements (critical):
- "summary" must be a 3 to 5 sentence overview of the topic: what it is, why it matters, and what sub-areas it covers. This is read first, before flashcards.
- Each flashcard answer must be a genuinely useful, self-contained explanation — 2 to 4 full sentences, not a one-liner or a single word/phrase. Include a concrete example, mechanism, or "why it matters" detail where relevant.
- Each flashcard "hint" must be a short (under 15 words) nudge toward the answer WITHOUT giving it away directly — point at the right direction of thinking, a category, or a related concept, not a paraphrase of the answer itself.
- Flashcards must cover distinct sub-concepts of the topic (definitions, causes, mechanisms, examples, comparisons, real-world implications) — do not repeat the same idea reworded.
- Each quiz question must test real understanding, not trivia. Each of the 4 options must be plausible (no obviously-wrong joke options).
- Each quiz explanation must be 1 to 2 sentences explaining WHY the correct answer is right AND why at least one common wrong choice is tempting but incorrect.
- If the given topic is extremely short, vague, or a single word, expand it into the most likely full academic subject a student would mean, and generate full-depth content for that interpretation rather than shallow content for the literal input.
- Match content depth and vocabulary to the requested difficulty level (given below): Beginner uses plain language and foundational concepts only; Intermediate assumes basic familiarity and introduces standard terminology; Advanced uses precise technical vocabulary and covers edge cases, trade-offs, or nuanced comparisons.

Rules:
- flashcards: exactly 6 items
- quiz: exactly {{QUIZ_COUNT}} items
- correctAnswer is a 0-based index into options
- Return raw JSON only. No backticks, no prose before or after.`;

const GEMINI_TIMEOUT_MS = 20000;

function withTimeout(promise, ms) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new TimeoutError()), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

export class TimeoutError extends Error {
  constructor() {
    super("Gemini request timed out");
    this.name = "TimeoutError";
  }
}

export class GeminiUpstreamError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "GeminiUpstreamError";
    this.status = status;
  }
}

const VALID_QUIZ_COUNTS = [3, 5, 8, 10];

export async function generateStudyMaterial(topic, difficulty = "Intermediate", quizCount = 5) {
  const safeQuizCount = VALID_QUIZ_COUNTS.includes(quizCount) ? quizCount : 5;
  const prompt = SYSTEM_PROMPT.replace("{{QUIZ_COUNT}}", String(safeQuizCount));

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
  });

  let result;
  try {
    result = await withTimeout(
      model.generateContent([prompt, `Topic: ${topic}`, `Difficulty level: ${difficulty}`]),
      GEMINI_TIMEOUT_MS
    );
  } catch (err) {
    if (err instanceof TimeoutError) throw err;

    const status = err?.status || err?.response?.status;
    if (status === 429) {
      throw new GeminiUpstreamError("Gemini rate limit exceeded", 429);
    }
    if (status >= 500) {
      throw new GeminiUpstreamError("Gemini service unavailable", 502);
    }
    throw new GeminiUpstreamError(err.message || "Unknown Gemini error", 502);
  }

  const rawText = result?.response?.text?.();

  if (!rawText || rawText.trim().length === 0) {
    throw new GeminiUpstreamError("Gemini returned an empty response", 502);
  }

  return rawText;
}
