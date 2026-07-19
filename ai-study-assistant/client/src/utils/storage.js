/**
 * Every read is wrapped in try/catch. LocalStorage values can be corrupted
 * by manual editing (devtools), a previous app version's incompatible
 * shape, or storage quota errors — none of that should ever throw during
 * render. This mirrors the same "never crash on untrusted data" principle
 * used for Gemini's output, applied here to a different untrusted source.
 */
export function getStorageItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded or storage disabled (private browsing) — fail silently,
    // the app should keep working in-memory even if persistence fails.
    return false;
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
