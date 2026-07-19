/**
 * The backend already validates and repairs Gemini's output before it ever
 * reaches the client (see server/src/validators/studyDataValidator.js). This
 * is a second, independent check on the frontend - defense in depth. It
 * guards against: a future backend bug, a history entry saved by an older
 * app version with a different shape, or manually-edited LocalStorage data.
 * Never throws - returns a boolean so callers can branch to ErrorState.
 */
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

export function isValidStudyData(data) {
  if (!data || typeof data !== "object") return false;
  if (typeof data.title !== "string" || data.title.trim().length === 0) return false;
  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) return false;
  if (!Array.isArray(data.quiz) || data.quiz.length === 0) return false;

  return data.flashcards.every(isValidFlashcard) && data.quiz.every(isValidQuizItem);
}
