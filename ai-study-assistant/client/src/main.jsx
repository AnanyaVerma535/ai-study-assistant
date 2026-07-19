import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeContext } from "./context/ThemeContext.jsx";
import { useDarkMode } from "./hooks/useDarkMode.js";
import "./index.css";

// Thin wrapper so useDarkMode (a hook) can supply ThemeContext's value -
// hooks can't be called at the top level of main.jsx directly, they need
// to run inside a component.
function Root() {
  const themeValue = useDarkMode();
  return (
    <ThemeContext.Provider value={themeValue}>
      <App />
    </ThemeContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
