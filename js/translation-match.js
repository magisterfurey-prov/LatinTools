/* Checks a student's English translation of a sentence against the accepted answers in
   data/translation-answers.js. Only the Level 1 sentences in Chapters 1-10 have answers there; every
   other sentence has no entry and stays "check your own" (hasAnswers() says which).

   Both the student's text and each accepted answer are cleaned up first: capitals, macrons and other
   accents, punctuation and hyphens are ignored, contractions are expanded (can't = can not, doesn't =
   does not), and a / an / the all count as one word, "the". So an article is needed wherever an accepted
   answer has one, and optional wherever it has (the). Everything else must match exactly, spelling
   included; there is no near-miss forgiveness.

   An accepted answer is a pattern: [a | b | c] is exactly one of the choices, (word) may be left out,
   and (a | b) is none or one of the choices. */
import { ANSWERS } from '../data/translation-answers.js';

const ARTICLES = new Set(['a', 'an', 'the']);

// Lowercase, without macrons or other accents, contractions expanded, and the single quote marks of a
// quotation taken off the words (a ' after an s stays: the Persians' king).
function plain(text) {
  let s = (typeof text === 'string' ? text : '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  s = s.replace(/[’‘`]/g, "'");
  s = s.replace(/(^|\s)'+/g, '$1').replace(/([^s\s])'+(?=\s|$)/g, '$1');
  s = s.replace(/\bcan't\b/g, 'can not').replace(/\bcannot\b/g, 'can not')
    .replace(/\bwon't\b/g, 'will not').replace(/\bshan't\b/g, 'shall not');
  return s.replace(/n't\b/g, ' not').replace(/'m\b/g, ' am').replace(/'re\b/g, ' are')
    .replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will');
}

// The words of a cleaned-up text, every article written "the" ("s/he" and "he/she" stay one word).
function wordsOf(s) {
  return s.replace(/-/g, ' ').replace(/[.,!?;:"“”()]/g, ' ').replace(/\s*\/\s*/g, '/')
    .split(/\s+/).filter(Boolean).map(w => (ARTICLES.has(w) ? 'the' : w));
}

// A student's "'s" can be "is" or "has" (he's loving) as well as a possessive (the mistress's lap).
function studentReadings(text) {
  const s = plain(text);
  const readings = [wordsOf(s)];
  if (/'s\b/.test(s)) readings.push(wordsOf(s.replace(/'s\b/g, ' is')), wordsOf(s.replace(/'s\b/g, ' has')));
  return readings;
}

// A pattern as a list of parts, each { choices: [[word, ...], ...], optional }.
function compile(pattern) {
  const parts = [];
  let text = '';
  const flush = () => {
    const words = wordsOf(plain(text));
    if (words.length) parts.push({ choices: [words], optional: false });
    text = '';
  };
  for (let i = 0; i < pattern.length;) {
    const c = pattern[i];
    if (c === '[' || c === '(') {
      const end = pattern.indexOf(c === '[' ? ']' : ')', i);
      flush();
      parts.push({
        choices: pattern.slice(i + 1, end).split(' | ').map(alt => wordsOf(plain(alt))),
        optional: c === '(',
      });
      i = end + 1;
    } else {
      text += c;
      i++;
    }
  }
  flush();
  return parts;
}

function fits(parts, words) {
  const seen = new Map();
  const from = (p, w) => {
    if (p === parts.length) return w === words.length;
    const key = p * (words.length + 1) + w;
    if (seen.has(key)) return seen.get(key);
    const { choices, optional } = parts[p];
    let ok = optional && from(p + 1, w);
    for (let c = 0; !ok && c < choices.length; c++) {
      const choice = choices[c];
      ok = w + choice.length <= words.length
        && choice.every((word, k) => word === words[w + k])
        && from(p + 1, w + choice.length);
    }
    seen.set(key, ok);
    return ok;
  };
  return from(0, 0);
}

const compiled = new Map();
function patternsFor(id) {
  if (!compiled.has(id)) compiled.set(id, ANSWERS[id].map(compile));
  return compiled.get(id);
}

// Does this sentence have accepted answers (Level 1, Chapters 1-10)?
export function hasAnswers(id) {
  return Object.prototype.hasOwnProperty.call(ANSWERS, id);
}

// Is the typed text one of the accepted translations of the sentence?
export function isAcceptedAnswer(id, text) {
  if (!hasAnswers(id)) return false;
  const patterns = patternsFor(id);
  return studentReadings(text).some(words => words.length > 0 && words.length <= 60
    && patterns.some(parts => fits(parts, words)));
}
