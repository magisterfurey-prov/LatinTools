// Sentences are numbered within their chapter, in the order they appear in the book's
// sentence data: a chapter's first sentence is 1, its second 2, and so on. The Translation
// page shows these numbers (and the version with sign-in lists them on its teacher dashboard).

// Map of sentence id -> its number within its chapter.
export function sentenceNumbers(sentences) {
  const next = {};
  const numbers = new Map();
  for (const s of sentences) {
    next[s.chapter] = (next[s.chapter] || 0) + 1;
    numbers.set(s.id, next[s.chapter]);
  }
  return numbers;
}
