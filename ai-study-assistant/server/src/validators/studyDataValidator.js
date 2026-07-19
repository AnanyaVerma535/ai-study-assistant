function extractJsonString(raw) {
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) text = fenceMatch[1].trim();

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  return text;
}

function safeParseJson(raw) {
  const candidate = extractJsonString(raw);
  try {
    return { ok: true, data: JSON.parse(candidate) };
  } catch {
    return { ok: false, data: null };
  }
}

function isValidFlashcard(card) {
  return (
    card &&
    typeof card.question === "string" &&
    card.question.trim().length > 0 &&
    typeof card.answer === "string" &&
    card.answer.trim().length > 0
  );
}

function isValidQuizItem(item) {
  return (
    item &&
    typeof item.question === "string" &&
    item.question.trim().length > 0 &&
    Array.isArray(item.options) &&
    item.options.length === 4 &&
    item.options.every((o) => typeof o === "string" && o.trim().length > 0) &&
    Number.isInteger(item.correctAnswer) &&
    item.correctAnswer >= 0 &&
    item.correctAnswer <= 3
  );
}

export function validateAndRepairStudyData(rawText) {
  const parsed = safeParseJson(rawText);
  if (!parsed.ok) {
    return { valid: false, reason: "MALFORMED_JSON" };
  }

  const data = parsed.data;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, reason: "INVALID_SCHEMA" };
  }

  const title =
    typeof data.title === "string" && data.title.trim().length > 0
      ? data.title.trim()
      : "Untitled Topic";

  const summary =
    typeof data.summary === "string" && data.summary.trim().length > 0
      ? data.summary.trim()
      : "No summary was generated for this topic.";

  const flashcardsRaw = Array.isArray(data.flashcards) ? data.flashcards : [];
  const flashcards = flashcardsRaw.filter(isValidFlashcard);

  if (flashcards.length === 0) {
    return { valid: false, reason: "MISSING_FLASHCARDS" };
  }

  const quizRaw = Array.isArray(data.quiz) ? data.quiz : [];
  const quiz = quizRaw.filter(isValidQuizItem).map((q) => ({
    question: q.question.trim(),
    options: q.options.map((o) => o.trim()),
    correctAnswer: q.correctAnswer,
    explanation: typeof q.explanation === "string" ? q.explanation.trim() : "",
  }));

  if (quiz.length === 0) {
    return { valid: false, reason: "MISSING_QUIZ" };
  }

  return {
    valid: true,
    data: {
      title,
      summary,
      flashcards: flashcards.map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
        hint: typeof f.hint === "string" && f.hint.trim().length > 0 ? f.hint.trim() : "",
      })),
      quiz,
    },
  };
}
