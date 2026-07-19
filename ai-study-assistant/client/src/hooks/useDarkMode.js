import { useState, useEffect, useCallback } from "react";
import { getStorageItem, setStorageItem } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/config";

function getInitialTheme() {
  const stored = getStorageItem(STORAGE_KEYS.THEME, null);
  if (stored === "dark" || stored === "light") return stored;

  // No stored preference yet - fall back to OS preference, matching the
  // same logic already run synchronously in index.html's pre-mount script.
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function useDarkMode() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Keeps the <html> class in sync with state. index.html's inline script
  // only handles the very first paint - after React mounts, this effect
  // becomes the single source of truth for the class.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setStorageItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
