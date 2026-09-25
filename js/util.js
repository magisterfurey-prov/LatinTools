// Macrons (vowel length marks) are ignored by default so students aren't
// penalized for not typing long marks. The one place that's NOT safe is 1st
// declension abl. sg. ("agricolā"), which is otherwise spelled identically to
// the nom. sg. ("agricola") -- see sameLatinRequireFinalMacron below.
const MACRON_MAP = { ā: 'a', ē: 'e', ī: 'i', ō: 'o', ū: 'u', ȳ: 'y', Ā: 'A', Ē: 'E', Ī: 'I', Ō: 'O', Ū: 'U', Ȳ: 'Y' };

function stripMacrons(str) {
  return str.split('').map(ch => MACRON_MAP[ch] || ch).join('');
}

export function normalizeLatin(str) {
  if (!str) return '';
  return stripMacrons(str).toLowerCase().trim().replace(/\s+/g, ' ');
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

// Same as sameLatin, but the final `n` letters must match exactly (macrons
// and all) -- used where the macron is the only thing distinguishing a form
// from the nominative singular: 1st declension abl. sg. "-ā" (n = 1) and
// 4th declension "-ūs" (n = 2).
export function sameLatinRequireFinalMacron(a, b, n = 1) {
  if (!a || !b) return false;
  const at = a.trim(), bt = b.trim();
  if (at.length < n || bt.length < n) return false;
  const endA = at.slice(-n).toLowerCase();
  const endB = bt.slice(-n).toLowerCase();
  if (endA !== endB) return false;
  return normalizeLatin(at.slice(0, -n)) === normalizeLatin(bt.slice(0, -n));
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
