import { API_BASE_URL, ERROR_CODES } from "../constants/config";

export async function generateStudyMaterial(topic, difficulty, quizCount, signal) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/study`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, quizCount }),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      const abortErr = new Error("Request aborted");
      abortErr.code = ERROR_CODES.ABORTED;
      throw abortErr;
    }
    const networkErr = new Error("Network request failed");
    networkErr.code = ERROR_CODES.NETWORK_ERROR;
    throw networkErr;
  }

  let body;
  try {
    body = await response.json();
  } catch {
    const parseErr = new Error("Server returned an unreadable response");
    parseErr.code = ERROR_CODES.UNKNOWN;
    throw parseErr;
  }

  if (!response.ok) {
    const apiErr = new Error(body?.error?.message || "Request failed");
    apiErr.code = body?.error?.code || ERROR_CODES.UNKNOWN;
    apiErr.status = response.status;
    throw apiErr;
  }

  return body.data;
}
