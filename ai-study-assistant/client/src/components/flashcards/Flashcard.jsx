export default function Flashcard({ question, answer, isFlipped, onFlip }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onFlip}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onFlip())}
      aria-label={isFlipped ? "Showing answer. Press to flip back." : "Showing question. Press to reveal answer."}
      className="group h-64 w-full cursor-pointer focus-visible:outline-none"
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative h-full w-full rounded-xl transition-transform duration-500 group-focus-visible:ring-2 group-focus-visible:ring-accent"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front - question */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-text-muted/10 bg-surface p-8 text-center dark:bg-surface-dark"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="font-mono text-xs uppercase tracking-wide text-accent">Question</span>
          <p className="font-display text-lg font-medium leading-snug text-slate-900 dark:text-slate-100">{question}</p>
          <span className="mt-2 text-xs text-text-muted">Tap to reveal answer</span>
        </div>

        {/* Back - answer */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-warm/30 bg-warm/10 p-8 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="font-mono text-xs uppercase tracking-wide text-warm">Answer</span>
          <p className="font-display text-base leading-snug text-slate-900 dark:text-slate-100">{answer}</p>
          <span className="mt-2 text-xs text-text-muted">Tap to flip back</span>
        </div>
      </div>
    </div>
  );
}
