import { useState } from "react";
import Card from "../common/Card";

export default function SummaryPanel({ summary, difficulty }) {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail on non-HTTPS/unsupported browsers -
      // fail silently rather than showing an alarming error for a
      // non-critical convenience feature.
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-base font-semibold">Summary</h2>
        <div className="flex items-center gap-2">
          {difficulty && (
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
              {difficulty}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg px-2 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-text-muted/10 hover:text-accent"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-text-muted">{summary}</p>
    </Card>
  );
}
