import Card from "../common/Card";

function StatBlock({ label, value, accentClass = "text-current" }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-mono text-2xl font-bold ${accentClass}`}>{value}</span>
      <span className="text-xs text-text-muted">{label}</span>
    </div>
  );
}

export default function StatsPanel({ stats }) {
  if (!stats) return null;

  const { total, correct, wrong, accuracy } = stats;

  return (
    <Card className="p-6">
      <h2 className="mb-4 font-display text-base font-semibold">Statistics</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBlock label="Total questions" value={total} />
        <StatBlock label="Correct" value={correct} accentClass="text-accent" />
        <StatBlock label="Wrong" value={wrong} accentClass="text-danger" />
        <StatBlock label="Accuracy" value={`${accuracy}%`} accentClass="text-warm" />
      </div>
    </Card>
  );
}
