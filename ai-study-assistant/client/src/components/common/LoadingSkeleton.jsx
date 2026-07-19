import { useState, useEffect } from "react";

function SkeletonLine({ width = "w-full" }) {
  return (
    <div
      className={`h-4 ${width} rounded bg-gradient-to-r from-text-muted/10 via-text-muted/20 to-text-muted/10 bg-[length:1000px_100%] animate-shimmer`}
    />
  );
}

// Reassures the user during a genuinely slow (but working) Gemini call -
// without this, a 20-40 second wait with no feedback reads as "broken"
// even though nothing has actually failed. Purely presentational; the
// real request timeout is unaffected and still lives in the backend.
function getStatusMessage(seconds) {
  if (seconds < 5) return "Sending your topic to the AI…";
  if (seconds < 15) return "Generating flashcards and quiz questions…";
  if (seconds < 30) return "Still working — longer topics can take a bit more time…";
  return "Almost there — this one's taking a little longer than usual…";
}

export default function LoadingSkeleton() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Generating study material">
      <div className="flex items-center justify-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="font-mono text-xs text-accent">
          {getStatusMessage(elapsed)} <span className="text-text-muted">({elapsed}s)</span>
        </p>
      </div>

      <div className="rounded-xl border border-text-muted/10 bg-surface dark:bg-surface-dark p-6">
        <SkeletonLine width="w-1/3" />
        <div className="mt-4 flex flex-col gap-3">
          <SkeletonLine />
          <SkeletonLine width="w-5/6" />
          <SkeletonLine width="w-2/3" />
        </div>
      </div>

      <div className="rounded-xl border border-text-muted/10 bg-surface dark:bg-surface-dark p-6">
        <SkeletonLine width="w-1/4" />
        <div className="mt-4 flex flex-col gap-2">
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-full" />
        </div>
      </div>

      <span className="sr-only">Generating your flashcards and quiz…</span>
    </div>
  );
}
