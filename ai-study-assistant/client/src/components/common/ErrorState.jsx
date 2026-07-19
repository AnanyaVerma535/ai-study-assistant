import { ERROR_CODES } from "../../constants/config";
import Button from "./Button";

const ERROR_CONTENT = {
  [ERROR_CODES.TIMEOUT]: {
    title: "That took too long",
    body: "The AI is taking longer than expected — this can happen with complex topics or high demand. Try a shorter, more specific topic, or retry in a moment.",
  },
  [ERROR_CODES.RATE_LIMITED]: {
    title: "Too many requests",
    body: "You've hit the rate limit. Wait a few seconds before trying again.",
  },
  [ERROR_CODES.UPSTREAM_ERROR]: {
    title: "AI service unavailable",
    body: "The study assistant is temporarily down or over quota. Wait a moment and retry — if this keeps happening, the API key's usage limit may need a few minutes to reset.",
  },
  [ERROR_CODES.NETWORK_ERROR]: {
    title: "No connection",
    body: "Check your internet connection and try again.",
  },
  [ERROR_CODES.MALFORMED_JSON]: {
    title: "Couldn't read the AI's response",
    body: "The response was malformed. Try rephrasing your topic slightly.",
  },
  [ERROR_CODES.INVALID_SCHEMA]: {
    title: "Unexpected response format",
    body: "The AI response didn't match what we expected. Please try again.",
  },
  [ERROR_CODES.MISSING_FLASHCARDS]: {
    title: "No flashcards generated",
    body: "The AI couldn't produce flashcards for this topic. Try being more specific.",
  },
  [ERROR_CODES.MISSING_QUIZ]: {
    title: "No quiz generated",
    body: "The AI couldn't produce quiz questions for this topic. Try being more specific.",
  },
  [ERROR_CODES.TOPIC_TOO_LONG]: {
    title: "Topic too long",
    body: "Please shorten your topic to under 500 characters.",
  },
  [ERROR_CODES.INVALID_INPUT]: {
    title: "Enter a topic",
    body: "Type a topic or paste some notes to get started.",
  },
  [ERROR_CODES.UNKNOWN]: {
    title: "Something went wrong",
    body: "An unexpected error occurred. Please try again.",
  },
};

export default function ErrorState({ code, onRetry }) {
  const content = ERROR_CONTENT[code] || ERROR_CONTENT[ERROR_CODES.UNKNOWN];

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/20 bg-danger/5 px-6 py-10 text-center">
      <h3 className="font-display text-lg font-semibold text-danger">{content.title}</h3>
      <p className="max-w-sm text-sm text-text-muted">{content.body}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
