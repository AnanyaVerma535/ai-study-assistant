import HistoryItem from "./HistoryItem";
import Card from "../common/Card";

export default function HistoryPanel({ history, onLoad, onDelete }) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 font-display text-base font-semibold">History</h2>

      {history.length === 0 ? (
        <p className="text-sm text-text-muted">
          Sessions you generate will be saved here for quick access later.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((session) => (
            <HistoryItem
              key={session.id}
              session={session}
              onLoad={onLoad}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
