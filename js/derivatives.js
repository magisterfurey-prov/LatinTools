// Derivative Practice: each question shows a Latin word and offers one of its
// English derivatives (from the vocabulary's derivatives list) among five
// everyday English words that don't come from Latin.
import { DISTRACTORS } from '../data/derivative-distractors.js';
import { DEFINITIONS } from '../data/derivative-definitions.js';
import { normalizeLatin, shuffle } from './util.js';

const WRONG_ANSWERS = 5;

// The Latin headword without macrons, notes, or "+ accusative":
// "ante + accusative" -> "ante", "dūcō" -> "duco".
function latinKey(entry) {
  return normalizeLatin(entry.latin.split(/[,(+]/)[0]).replace(/[^a-z]/g, '');
}

// The definition shown as a hint after a wrong answer.
export function definitionOf(word) {
  return DEFINITIONS[word] || DISTRACTORS[word[0]]?.[word] || '';
}

// The right answer plus five wrong ones, shuffled. Wrong answers start with
// the same letter as the Latin word or as the right answer, and skip words
// that could pass for one of its derivatives or that translate it: arrow for
// rogō (it starts like arrogate), bell for bellum, land for terra ("land, earth").
export function derivativeQuestion(entry, derivatives) {
  const answer = derivatives[Math.floor(Math.random() * derivatives.length)];
  const latin = latinKey(entry);
  const meaning = new Set(entry.english.toLowerCase().match(/[a-z]+/g) || []);
  const looksRelated = word =>
    derivatives.some(d => d.slice(0, 4) === word.slice(0, 4))
    || word.startsWith(latin.slice(0, 3))
    || meaning.has(word);
  const candidates = letter => shuffle(Object.keys(DISTRACTORS[letter] || {})).filter(w => !looksRelated(w));

  let wrong;
  if (answer[0] === latin[0]) {
    wrong = candidates(latin[0]).slice(0, WRONG_ANSWERS);
  } else {
    // Two more starting like the answer and three like the Latin word, so
    // each letter begins three of the six choices and neither gives it away.
    const byAnswer = candidates(answer[0]), byLatin = candidates(latin[0]);
    wrong = [...byAnswer.slice(0, 2), ...byLatin.slice(0, 3)];
    for (const w of [...byAnswer.slice(2), ...byLatin.slice(3)]) {
      if (wrong.length < WRONG_ANSWERS) wrong.push(w);
    }
  }
  return { answer, options: shuffle([answer, ...wrong]) };
}
