export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-text-muted/25 px-6 py-16 text-center">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="h-12 w-12 text-text-muted/40"
        aria-hidden="true"
      >
        <rect x="6" y="10" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="18" width="28" height="20" rx="3" fill="var(--tw-bg-opacity,1)" className="fill-base dark:fill-base-dark" stroke="currentColor" strokeWidth="2" />
        <path d="M20 26h14M20 31h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h3 className="font-display text-lg font-semibold text-text-muted">
        Nothing to study yet
      </h3>
      <p className="max-w-sm text-sm text-text-muted/80">
        Type a topic above — or tap one of the suggestions — and your flashcards and quiz will show up here.
      </p>
    </div>
  );
}
