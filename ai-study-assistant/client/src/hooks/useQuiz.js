import { useState, useMemo, useCallback, useEffect } from "react";

export function useQuiz(quiz) {
  const [activeQuestions, setActiveQuestions] = useState(quiz);
  const [answers, setAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setActiveQuestions(quiz);
    setAnswers({});
    setIsSubmitted(false);
  }, [quiz]);

  const selectAnswer = useCallback(
    (questionIndex, optionIndex) => {
      if (isSubmitted) return;
      setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    },
    [isSubmitted]
  );

  const submitQuiz = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  const results = useMemo(() => {
    const total = activeQuestions.length;
    let correct = 0;
    const incorrectQuestions = [];

    activeQuestions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct += 1;
      } else {
        incorrectQuestions.push(q);
      }
    });

    const wrong = total - correct;
    const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

    return { total, correct, wrong, accuracy, incorrectQuestions };
  }, [activeQuestions, answers]);

  // Restarts the quiz using only the questions that were answered
  // incorrectly last round - this is "retry incorrect only".
  const retryIncorrect = useCallback(() => {
    setActiveQuestions(results.incorrectQuestions);
    setAnswers({});
    setIsSubmitted(false);
  }, [results.incorrectQuestions]);

  const allAnswered = activeQuestions.every((_, i) => answers[i] !== undefined);

  return {
    activeQuestions,
    answers,
    isSubmitted,
    allAnswered,
    results,
    selectAnswer,
    submitQuiz,
    retryIncorrect,
  };
}
