export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Stable contract shared with the backend's error.code field.
// Components branch on these, never on raw message strings.
export const ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  TOPIC_TOO_LONG: "TOPIC_TOO_LONG",
  MALFORMED_JSON: "MALFORMED_JSON",
  INVALID_SCHEMA: "INVALID_SCHEMA",
  MISSING_FLASHCARDS: "MISSING_FLASHCARDS",
  MISSING_QUIZ: "MISSING_QUIZ",
  TIMEOUT: "TIMEOUT",
  RATE_LIMITED: "RATE_LIMITED",
  UPSTREAM_ERROR: "UPSTREAM_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  ABORTED: "ABORTED",
  UNKNOWN: "UNKNOWN",
};

// Matches the key read synchronously in index.html's pre-mount script —
// must stay identical or the theme will flash/mismatch on load.
export const STORAGE_KEYS = {
  THEME: "study-assistant-theme",
  HISTORY: "study-assistant-history",
};
