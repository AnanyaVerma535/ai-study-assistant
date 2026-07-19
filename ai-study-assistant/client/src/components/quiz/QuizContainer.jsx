import { useQuiz } from "../../hooks/useQuiz";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import Button from "../common/Button";
import Card from "../common/Card";

export default function QuizContainer({ quiz, onStatsUpdate }) {
  const {
    activeQuestions,
    answers,
    isSubmitted,
    allAnswered,
    results,
    selectAnswer,
    submitQuiz,
    retryIncorrect,
  } = useQuiz(quiz);

  function handleSubmit() {
    submitQuiz();
    onStatsUpdate?.(results);
  }

  function handleRetryIncorrect() {
    retryIncorrect();
  }

  function handleDone() {
    // Collapses back to a fresh view of the full quiz rather than leaving
    // the user stuck on a "retry incorrect" subset with nowhere to go.
    retryIncorrect();
  }

  if (isSubmitted) {
    return (
      <QuizResult
        results={results}
        onRetryIncorrect={handleRetryIncorrect}
        onDone={handleDone}
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Quiz</h2>
        <span className="font-mono text-xs text-text-muted">
          {Object.keys(answers).length} / {activeQuestions.length} answered
        </span>
      </div>

      <div>
        {activeQuestions.map((q, i) => (
          <QuizQuestion
            key={i}
            question={q}
            index={i}
            selectedOption={answers[i]}
            isSubmitted={isSubmitted}
            onSelect={(optionIndex) => selectAnswer(i, optionIndex)}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSubmit} disabled={!allAnswered}>
          Submit quiz
        </Button>
      </div>
    </Card>
  );
}
