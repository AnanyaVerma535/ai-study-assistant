# AI Study Assistant

A small React app that takes free-form text — a topic or pasted notes — sends it to an AI model, and turns the result into an interactive study tool (flashcards + quiz). Built to a strict 8-hour time box.

---

## Overview

A student types a topic (e.g. `"Operating System Deadlock"`) or pastes raw notes into a single input. The backend sends that topic to Gemini with a strict JSON-only prompt and returns structured study material; the frontend renders it as an interactive flashcard deck and a scored multiple-choice quiz.

Calling the model is the easy part. The actual engineering problem this project solves is **turning unpredictable AI output into reliable UI** — and handling it correctly when the model gets things wrong. Gemini's output can arrive malformed, incomplete, mis-shaped, empty, rate-limited, or simply too slow. None of those cases should ever crash the app or show the user a raw error. Every layer here — backend JSON extraction/repair, per-field schema validation, a second independent frontend validation pass, typed error codes instead of raw messages, and AbortController-based request cancellation — exists specifically to absorb that unpredictability before it reaches the UI.

---

## Features

**Generation**
- Free-form topic/notes input
- Backend-enforced strict JSON contract with Gemini
- Server-side validation and best-effort repair of malformed AI output

**Flashcards**
- 3D flip animation (question ↔ answer)
- Next / previous navigation
- Shuffle

**Quiz**
- Multiple choice questions with per-question explanations
- Live scoring
- Retry incorrect answers only, without regenerating the whole quiz

**Statistics**
- Total questions, correct, wrong, accuracy %

**History**
- Past sessions persisted to LocalStorage
- Reload any previous session without a new API call

**Resilience & UX**
- Loading skeleton, empty state, and error state as distinct components
- Retry button on every failure
- AbortController-based request cancellation — submitting a new topic cancels any in-flight request, and a stale response can never overwrite a newer one
- Dark mode
- Fully responsive layout

---

## Folder Structure

```
ai-study-assistant/
├── client/                      # React 19 + Vite frontend
│   └── src/
│       ├── api/                 # fetch layer, talks to backend only
│       ├── components/
│       │   ├── common/          # Button, Card, LoadingSkeleton, ErrorState, EmptyState, DarkModeToggle
│       │   ├── input/           # TopicInputForm
│       │   ├── flashcards/      # FlashcardDeck, Flashcard
│       │   ├── quiz/            # QuizContainer, QuizQuestion, QuizResult
│       │   ├── statistics/      # StatsPanel
│       │   └── history/         # HistoryPanel, HistoryItem
│       ├── hooks/                # useStudySession, useDarkMode, useHistory, useFlashcards, useQuiz
│       ├── context/              # ThemeContext (only global state that needs it)
│       ├── utils/                # validateStudyData, storage
│       └── constants/            # config.js — API URL, error codes
│
├── server/                      # Node.js + Express backend
│   └── src/
│       ├── routes/               # study.routes.js
│       ├── controllers/          # study.controller.js — maps outcomes to HTTP status codes
│       ├── services/             # gemini.service.js — only file that touches the Gemini API
│       ├── validators/           # studyDataValidator.js — validate + repair
│       ├── middleware/           # errorHandler, requestLogger, rate limiter
│       └── config/                # env.js — fail-fast environment loading
│
└── README.md
```

**Why it's split this way:** the frontend never talks to Gemini directly — it only ever calls our own backend. That's not just an organizational choice, it's the mechanism that keeps the API key out of the browser bundle entirely (see below).

---

## Installation

Requires Node.js 18+.

```bash
git clone <your-repo-url>
cd ai-study-assistant

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

## Environment Variables

**`server/.env`** (copy from `server/.env.example`)

```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**`client/.env`** (copy from `client/.env.example`)

```
VITE_API_BASE_URL=http://localhost:5000
```

The Gemini API key lives **only** in `server/.env` and is read by `gemini.service.js` on the backend. It is never sent to, or accessible from, the browser — the frontend only ever calls our own `/api/study` endpoint.

---

## Running the Backend

```bash
cd server
npm run dev      # nodemon, auto-restarts on change
# or
npm start        # plain node
```

Server runs at `http://localhost:5000` by default.

---

## Running the Frontend

```bash
cd client
npm run dev
```

App runs at `http://localhost:5173` by default. Make sure the backend is running first — the frontend has no fallback data source.

---

## AI Usage Disclosure

This project uses Google's **Gemini API** (`gemini-2.0-flash`) as the sole content-generation engine. All flashcards, quiz questions, options, correct answers, and explanations shown in the app are AI-generated at request time — none are hardcoded or pre-written.

Development of this codebase itself was AI-assisted (Claude, via an iterative build process — backend first, then frontend, feature by feature). The architecture decisions, validation strategy, and error-handling design were specified and reviewed at each step rather than generated in one pass, and every file was explained before moving to the next so the structure is fully understood, not just copy-pasted. I can walk through and justify any design decision in this codebase in an interview setting.

---

## Known Limitations

- **No authentication** — history is per-browser (LocalStorage), not per-user. Clearing browser storage clears history permanently.
- **No persistent database** — sessions aren't stored server-side, so there's no cross-device sync.
- **Rate limiting is IP-based and in-memory** — resets on server restart; not suitable as-is for a multi-instance deployment (would need a shared store like Redis).
- **Gemini's JSON mode reduces but doesn't eliminate malformed output** — the repair layer is a best-effort safety net, not a guarantee; some responses will still fail validation and surface as an error state instead of silently guessing at content.
- **Fixed content shape** — always exactly 6 flashcards and 5 quiz questions per session; not currently configurable by the user.
- **No streaming** — the full response is generated server-side before anything renders, so generation feels like one wait rather than a progressive reveal.

---

## Future Improvements

- Optional user accounts with server-side history (would swap LocalStorage for a real database without touching frontend components, since `useHistory` already isolates storage access behind a hook)
- Streamed generation (render flashcards as they arrive rather than waiting for the full payload)
- Configurable deck size and difficulty level
- Export flashcards/quiz to PDF or Anki-compatible format
- Spaced-repetition scheduling for flashcards instead of linear next/previous
- Redis-backed rate limiting for multi-instance deployments

---

## Time Spent (8-hour box)

This was built to a strict ~8 hour cap, as specified in the assignment. Breakdown:

| Phase | Time |
|---|---|
| Planning, folder structure, prompt/schema design | ~0.5 hr |
| Backend: Express setup, Gemini integration, JSON validation/repair layer | ~2 hrs |
| Frontend: hooks, API layer, AbortController lifecycle | ~1.5 hrs |
| Frontend: flashcards, quiz, stats, history, dark mode, responsive layout | ~2.5 hrs |
| Debugging real AI-failure modes (quota limits, timeout tuning, flip animation) | ~1 hr |
| Documentation | ~0.5 hr |
| **Total** | **~8 hrs** |

*(Adjust to reflect your actual time before submitting — this is a template based on the build order used.)*

---

## If I Had More Time

Per the brief's instruction to stop at the time box and note what's next, rather than keep building:

- **Streaming responses** — currently the full JSON payload is generated server-side before anything renders; the loading skeleton is a placeholder, not a progressive reveal. Streaming individual flashcards as they're generated would materially improve perceived speed.
- **Automated tests for the validator** — `studyDataValidator.js` is the single highest-value file to unit test (malformed JSON, missing fields, wrong types, partial arrays), since it's the core "never crash" guarantee and currently only verified manually.
- **A visible retry/backoff indicator for rate limits** — right now a 429 just shows "too many requests"; surfacing the actual retry-after countdown from Gemini's error response would be a small, concrete UX improvement.
- **Server-side session storage** — history is LocalStorage-only today, so it doesn't survive a cleared browser or sync across devices.
- **Configurable flashcard/quiz count** — currently fixed at 6 and 5 items regardless of topic complexity.

---

## License

MIT — free to use, modify, and learn from.
