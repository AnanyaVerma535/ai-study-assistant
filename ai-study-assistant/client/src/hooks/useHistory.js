import { useState, useCallback } from "react";
import { getStorageItem, setStorageItem } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/config";

const MAX_HISTORY_ITEMS = 20;

export function useHistory() {
  const [history, setHistory] = useState(() => getStorageItem(STORAGE_KEYS.HISTORY, []));

  const saveSession = useCallback((studyData) => {
    setHistory((prev) => {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: studyData.title,
        data: studyData,
        savedAt: new Date().toISOString(),
      };

      // Newest first, capped so LocalStorage doesn't grow unbounded over
      // a long-lived browser profile.
      const next = [entry, ...prev].slice(0, MAX_HISTORY_ITEMS);
      setStorageItem(STORAGE_KEYS.HISTORY, next);
      return next;
    });
  }, []);

  const deleteSession = useCallback((id) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id);
      setStorageItem(STORAGE_KEYS.HISTORY, next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setStorageItem(STORAGE_KEYS.HISTORY, []);
  }, []);

  const getSessionById = useCallback(
    (id) => history.find((item) => item.id === id) || null,
    [history]
  );

  return { history, saveSession, deleteSession, clearHistory, getSessionById };
}
