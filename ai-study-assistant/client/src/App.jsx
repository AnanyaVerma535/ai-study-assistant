import { useState, useCallback, useRef, useEffect } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import TopicInputForm from "./components/input/TopicInputForm";
import LoadingSkeleton from "./components/common/LoadingSkeleton";
import EmptyState from "./components/common/EmptyState";
import ErrorState from "./components/common/ErrorState";
import FlashcardDeck from "./components/flashcards/FlashcardDeck";
import QuizContainer from "./components/quiz/QuizContainer";
import StatsPanel from "./components/statistics/StatsPanel";
import SummaryPanel from "./components/statistics/SummaryPanel";
import HistoryPanel from "./components/history/HistoryPanel";
import { useStudySession } from "./hooks/useStudySession";
import { useHistory } from "./hooks/useHistory";
import { isValidStudyData } from "./utils/validateStudyData";
import { downloadMarkdown } from "./utils/exportStudyData";
import { ERROR_CODES } from "./constants/config";

export default function App() {
  const { status, data, error, generate, reset } = useStudySession();
  const { history, saveSession, deleteSession } = useHistory();
  const [quizStats, setQuizStats] = useState(null);
  const [viewingHistoryData, setViewingHistoryData] = useState(null);

  // Tracks the last data object that was saved to history, so a fresh
  // successful generation is saved exactly once (not on every re-render)
  // and a reloaded history session is never re-saved as a duplicate.
  const savedRef = useRef(null);

  const activeData = viewingHistoryData ?? data;

  useEffect(() => {
    if (
      status === "success" &&
      data &&
      !viewingHistoryData &&
      isValidStudyData(data) &&
      savedRef.current !== data
    ) {
      saveSession(data);
      savedRef.current = data;
    }
  }, [status, data, viewingHistoryData, saveSession]);

  const handleGenerate = useCallback(
    async (topic, difficulty, quizCount) => {
      setViewingHistoryData(null);
      setQuizStats(null);
      await generate(topic, difficulty, quizCount);
    },
    [generate]
  );

  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  const handleLoadHistory = useCallback(
    (id) => {
      const session = history.find((item) => item.id === id);
      if (session) {
        setViewingHistoryData(session.data);
        setQuizStats(null);
      }
    },
    [history]
  );

  const handleDeleteHistory = useCallback(
    (id) => {
      deleteSession(id);
    },
    [deleteSession]
  );

  const handleStatsUpdate = useCallback((results) => {
    setQuizStats(results);
  }, []);

  function handleDownload() {
    if (activeData) downloadMarkdown(activeData);
  }

  function handlePrint() {
    window.print();
  }

  function renderContent() {
    if (status === "loading") {
      return <LoadingSkeleton />;
    }

    if (status === "error") {
      return <ErrorState code={error?.code || ERROR_CODES.UNKNOWN} onRetry={handleRetry} />;
    }

    if (!activeData) {
      return <EmptyState />;
    }

    if (!isValidStudyData(activeData)) {
      return <ErrorState code={ERROR_CODES.INVALID_SCHEMA} onRetry={handleRetry} />;
    }

    return (
      <div id="printable-content" className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-xl font-semibold">{activeData.title}</h1>
          <div className="flex shrink-0 gap-2 print:hidden">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg border border-text-muted/20 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Download .md
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg border border-text-muted/20 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Print
            </button>
          </div>
        </div>
        <SummaryPanel summary={activeData.summary} difficulty={activeData.difficulty} />
        <FlashcardDeck flashcards={activeData.flashcards} />
        <QuizContainer quiz={activeData.quiz} onStatsUpdate={handleStatsUpdate} />
        {quizStats && <StatsPanel stats={quizStats} />}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-base text-slate-900 dark:bg-base-dark dark:text-slate-100">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
        <TopicInputForm onSubmit={handleGenerate} isLoading={status === "loading"} />

        {renderContent()}

        <HistoryPanel history={history} onLoad={handleLoadHistory} onDelete={handleDeleteHistory} />
      </main>

      <Footer />
    </div>
  );
}
