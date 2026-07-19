import { createContext, useContext } from "react";

// Split into two contexts (value + setter) is unnecessary here since theme
// changes are infrequent (a single toggle click) - the re-render cost of
// one combined context is negligible, and it keeps consumer code simpler.
export const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error("useTheme must be used within a ThemeContext.Provider");
  }
  return ctx;
}
