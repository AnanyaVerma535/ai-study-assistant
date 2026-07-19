/**
 * Minimal request logger. Not a replacement for a real logging library
 * (morgan, winston) in production — this exists so that during a live
 * interview demo you can watch requests land in the terminal in real time,
 * which is genuinely useful for explaining the AbortController behavior:
 * you can visibly see a request logged, then a second one immediately
 * after when the user re-submits, proving the first was superseded.
 */
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
  });

  next();
}
