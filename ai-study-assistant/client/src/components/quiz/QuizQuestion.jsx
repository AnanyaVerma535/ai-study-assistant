const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function QuizQuestion({ question, index, selectedOption, isSubmitted, onSelect }) {
  return (
    <div className="border-b border-text-muted/10 py-5 last:border-none">
      <p className="mb-3 font-display text-sm font-medium">
        <span className="mr-2 text-accent">{index + 1}.</span>
        {question.question}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedOption === optionIndex;
          const isCorrectOption = optionIndex === question.correctAnswer;

          let stateClasses = "border-text-muted/20 hover:border-accent/50";
          if (isSubmitted) {
            if (isCorrectOption) {
              stateClasses = "border-accent bg-accent/10";
            } else if (isSelected && !isCorrectOption) {
              stateClasses = "border-danger bg-danger/10";
            } else {
              stateClasses = "border-text-muted/10 opacity-60";
            }
          } else if (isSelected) {
            stateClasses = "border-accent bg-accent/5";
          }

          return (
            <button
              key={optionIndex}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelect(optionIndex)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${stateClasses}`}
            >
              <span className="font-mono text-xs text-text-muted">{OPTION_LETTERS[optionIndex]}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {isSubmitted && question.explanation && (
        <p className="mt-3 rounded-lg bg-text-muted/5 px-4 py-2.5 text-xs text-text-muted">
          <span className="font-medium text-current">Explanation: </span>
          {question.explanation}
        </p>
      )}
    </div>
  );
}
