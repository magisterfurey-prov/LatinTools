// Macrons (vowel length marks) are compared exactly -- they're the ONLY thing
// distinguishing some forms (e.g. 1st decl. nom. sg. "agricola" vs. abl. sg.
// "agricolā"), so stripping them would make a chart ungradable. We only
// normalize case and surrounding whitespace; macron-entry buttons in the UI
// make typing them practical.
export function normalizeLatin(str) {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function insertAtCursor(input, text) {
  if (!input) return;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.value = input.value.slice(0, start) + text + input.value.slice(end);
  const pos = start + text.length;
  input.setSelectionRange(pos, pos);
  input.focus();
}

export function sameLatin(a, b) {
  return normalizeLatin(a) === normalizeLatin(b);
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
