/**
 * Builds a single Markdown string from study data - used for both the
 * "Download .md" export and as the basis for the print view. Kept as a
 * pure function (no DOM/browser APIs) so it's easy to reason about and
 * test in isolation from the download/print mechanics themselves.
 */
export function buildStudyMarkdown(data) {
  const lines = [];

  lines.push(`# ${data.title}`);
  lines.push("");

  if (data.difficulty) {
    lines.push(`*Difficulty: ${data.difficulty}*`);
    lines.push("");
  }

  if (data.summary) {
    lines.push("## Summary");
    lines.push("");
    lines.push(data.summary);
    lines.push("");
  }

  lines.push("## Flashcards");
  lines.push("");
  data.flashcards.forEach((card, i) => {
    lines.push(`**${i + 1}. ${card.question}**`);
    lines.push("");
    lines.push(card.answer);
    lines.push("");
  });

  lines.push("## Quiz");
  lines.push("");
  data.quiz.forEach((q, i) => {
    lines.push(`**${i + 1}. ${q.question}**`);
    q.options.forEach((option, optionIndex) => {
      const marker = optionIndex === q.correctAnswer ? "✓" : " ";
      lines.push(`- [${marker}] ${option}`);
    });
    if (q.explanation) {
      lines.push("");
      lines.push(`*Explanation: ${q.explanation}*`);
    }
    lines.push("");
  });

  return lines.join("\n");
}

/**
 * Triggers a browser download of the markdown as a .md file. Uses a
 * Blob + temporary anchor element - the standard client-side download
 * pattern, no server round-trip needed since the data is already local.
 */
export function downloadMarkdown(data) {
  const markdown = buildStudyMarkdown(data);
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const filename = `${data.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
