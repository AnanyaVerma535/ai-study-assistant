export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-text-muted/10 bg-surface dark:bg-surface-dark shadow-sm transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
