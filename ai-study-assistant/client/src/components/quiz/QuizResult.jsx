import Button from "../common/Button";
import Card from "../common/Card";

export default function QuizResult({ results, onRetryIncorrect, onDone }) {
  const { total, correct, wrong, accuracy, incorrectQuestions } = results;
  const hasIncorrect = incorrectQuestions.length > 0;

  return (
    <Card className="flex flex-col items-center gap-4 p-8 text-center">
      <span className="font-mono text-xs uppercase tracking-wide text-text-muted">
        Quiz complete
      </span>

      <p className="font-display text-4xl font-bold text-accent">{accuracy}%</p>

      <div className="flex gap-6 font-mono text-sm">
        <span className="text-current">{total} total</span>
        <span className="text-accent">{correct} correct</span>
        <span className="text-danger">{wrong} wrong</span>
      </div>

      <div className="mt-2 flex gap-3">
        {hasIncorrect && (
          <Button variant="primary" onClick={onRetryIncorrect}>
            Retry {incorrectQuestions.length} incorrect
          </Button>
        )}
        <Button variant="secondary" onClick={onDone}>
          {hasIncorrect ? "Done" : "Great job — done"}
        </Button>
      </div>
    </Card>
  );
}
