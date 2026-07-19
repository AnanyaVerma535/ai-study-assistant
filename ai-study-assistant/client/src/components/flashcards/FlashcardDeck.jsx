import { useEffect, useState } from "react";
import { useFlashcards } from "../../hooks/useFlashcards";
import Flashcard from "./Flashcard";
import Button from "../common/Button";
import Card from "../common/Card";

export default function FlashcardDeck({ flashcards }) {
  const [copied, setCopied] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const {
    currentCard,
    currentIndex,
    total,
    isFlipped,
    isCurrentKnown,
    seenPercent,
    knownPercent,
    goNext,
    goPrevious,
    shuffle,
    flip,
    toggleKnown,
    reviewUnknown,
  } = useFlashcards(flashcards);

  // Hint is per-card - hide it whenever the visible card changes so the
  // next card doesn't start with a stale hint already showing.
  useEffect(() => {
    setShowHint(false);
  }, [currentIndex]);

  // Keyboard shortcuts: ← / → navigate, Space flips, K marks known, H toggles hint.
  // Ignored while focus is in a text input so typing a topic isn't hijacked.
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;

      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrevious();
      else if (e.key === " ") {
        e.preventDefault();
        flip();
      } else if (e.key === "k" || e.key === "K") {
        toggleKnown();
      } else if (e.key === "h" || e.key === "H") {
        setShowHint((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious, flip, toggleKnown]);

  if (!currentCard) return null;

  async function handleCopyAll() {
    const text = flashcards
      .map((card, i) => `${i + 1}. Q: ${card.question}\n   A: ${card.answer}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Non-critical convenience feature - fail silently if clipboard
      // access is unavailable (unsupported browser, non-HTTPS context).
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Flashcards</h2>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-muted">
            {seenPercent}% seen · {knownPercent}% known
          </span>
          <span className="font-mono text-xs text-text-muted">
            {currentIndex + 1} / {total}
          </span>
          <button
            type="button"
            onClick={handleCopyAll}
            className="rounded-lg px-2 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-text-muted/10 hover:text-accent"
          >
            {copied ? "Copied!" : "Copy all"}
          </button>
          {currentCard.hint && (
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="rounded-lg px-2 py-1 text-xs font-medium text-warm transition-colors hover:bg-warm/10"
            >
              {showHint ? "Hide hint" : "Show hint"}
            </button>
          )}
        </div>
      </div>

      {showHint && currentCard.hint && (
        <p className="mb-4 rounded-lg bg-warm/10 px-4 py-2.5 text-center text-sm text-warm">
          💡 {currentCard.hint}
        </p>
      )}

      <Flashcard
        question={currentCard.question}
        answer={currentCard.answer}
        isFlipped={isFlipped}
        onFlip={flip}
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Button variant="secondary" onClick={goPrevious}>
          ← Previous
        </Button>
        <Button variant="secondary" onClick={shuffle}>
          Shuffle
        </Button>
        <Button
          variant={isCurrentKnown ? "primary" : "secondary"}
          onClick={toggleKnown}
        >
          {isCurrentKnown ? "✓ Known" : "Mark known"}
        </Button>
        <Button variant="secondary" onClick={reviewUnknown}>
          Review unknown
        </Button>
        <Button variant="secondary" onClick={goNext}>
          Next →
        </Button>
      </div>

      <p className="mt-3 text-center text-xs text-text-muted">
        Shortcuts: ← / → navigate · Space flip · K mark known · H hint
      </p>
    </Card>
  );
}
