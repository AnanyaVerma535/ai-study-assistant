import dotenv from "dotenv";

dotenv.config();

const REQUIRED_VARS = ["GEMINI_API_KEY"];

// Fail fast: if a required var is missing, crash at startup with a clear
// message instead of crashing later, mid-request, with a confusing
// "cannot read property of undefined" deep inside the Gemini SDK.
function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variable(s): ${missing.join(", ")}\n` +
        `Copy server/.env.example to server/.env and fill in the values.`
    );
    process.exit(1);
  }
}

validateEnv();

export const env = {
  PORT: process.env.PORT || 5000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",
};
