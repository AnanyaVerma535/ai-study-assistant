import { useState, useRef, useCallback } from "react";
import { generateStudyMaterial } from "../api/studyService";
import { ERROR_CODES } from "../constants/config";

export function useStudySession() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const generate = useCallback(async (topic, difficulty, quizCount) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus("loading");
    setError(null);

    try {
      const result = await generateStudyMaterial(topic, difficulty, quizCount, controller.signal);

      if (abortControllerRef.current !== controller) return;

      setData(result);
      setStatus("success");
    } catch (err) {
      if (err.code === ERROR_CODES.ABORTED || abortControllerRef.current !== controller) {
        return;
      }

      setError({ code: err.code, message: err.message, status: err.status });
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, generate, reset };
}
