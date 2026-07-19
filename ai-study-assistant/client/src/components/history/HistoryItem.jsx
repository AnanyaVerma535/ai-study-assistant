import Button from "../common/Button";

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryItem({ session, onLoad, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-text-muted/10 px-4 py-3">
      <button
        type="button"
        onClick={() => onLoad(session.id)}
        className="flex-1 text-left"
      >
        <p className="truncate text-sm font-medium">{session.title}</p>
        <p className="font-mono text-xs text-text-muted">{formatDate(session.savedAt)}</p>
      </button>

      <Button variant="secondary" onClick={() => onDelete(session.id)} className="shrink-0">
        Remove
      </Button>
    </div>
  );
}
