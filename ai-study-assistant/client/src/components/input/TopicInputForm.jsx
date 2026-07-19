import { useState } from "react";
import Button from "../common/Button";

const MAX_LENGTH = 500;
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const QUIZ_COUNTS = [3, 5, 8, 10];
const SUGGESTED_TOPICS = [
  "Operating System Deadlock",
  "The French Revolution: causes and consequences",
  "How TCP three-way handshake works",
  "Photosynthesis: light and dark reactions",
];

export default function TopicInputForm({ onSubmit, isLoading }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [quizCount, setQuizCount] = useState(5);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed, difficulty, quizCount);
  }

  function handleChipClick(suggestion) {
    setTopic(suggestion);
  }

  const remaining = MAX_LENGTH - topic.length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="topic-input" className="sr-only">
        Study topic or notes
      </label>
      <textarea
        id="topic-input"
        value={topic}
        onChange={(e) => setTopic(e.target.value.slice(0, MAX_LENGTH))}
        placeholder='Enter a topic — e.g. "Operating System Deadlock" — or paste your notes'
        rows={3}
        disabled={isLoading}
        className="w-full resize-none rounded-xl border border-text-muted/20 bg-surface px-4 py-3 text-sm text-current placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60 dark:bg-surface-dark"
      />

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_TOPICS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={isLoading}
            onClick={() => handleChipClick(suggestion)}
            className="rounded-full border border-text-muted/20 px-3 py-1 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-text-muted">Level:</span>
        {DIFFICULTIES.map((level) => (
          <button
            key={level}
            type="button"
            disabled={isLoading}
            onClick={() => setDifficulty(level)}
            aria-pressed={difficulty === level}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              difficulty === level
                ? "bg-accent text-white"
                : "bg-text-muted/10 text-text-muted hover:bg-text-muted/20"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-text-muted">Quiz questions:</span>
        {QUIZ_COUNTS.map((count) => (
          <button
            key={count}
            type="button"
            disabled={isLoading}
            onClick={() => setQuizCount(count)}
            aria-pressed={quizCount === count}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              quizCount === count
                ? "bg-accent text-white"
                : "bg-text-muted/10 text-text-muted hover:bg-text-muted/20"
            }`}
          >
            {count}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-text-muted">{remaining} characters left</span>
        <Button type="submit" disabled={isLoading || topic.trim().length === 0}>
          {isLoading ? "Generating…" : "Generate study material"}
        </Button>
      </div>
    </form>
  );
}
