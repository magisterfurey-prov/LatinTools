// Derivative Practice: each question shows a Latin word and offers one of its
// English derivatives (from the vocabulary's derivatives list) among five
// everyday English words that start with the same two letters as the Latin
// word or the right answer.
import { DISTRACTORS, FROM_LATIN } from '../data/derivative-distractors.js';
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
  return DEFINITIONS[word] || DISTRACTORS[word.slice(0, 2)]?.[word] || '';
}

// Pool words with this start that can't pass for a derivative of the word:
// none that shares four letters with one of its derivatives (arrow for rogō,
// which has arrogate), none that translates it (land for terra), and no
// Latin-derived word that comes from it (see FROM_LATIN).
function wrongAnswers(start, latin, derivatives, meaning) {
  return shuffle(Object.keys(DISTRACTORS[start] || {})).filter(word =>
    !derivatives.some(d => d.slice(0, 4) === word.slice(0, 4))
    && !meaning.has(word)
    && !FROM_LATIN[word]?.includes(latin));
}

// The right answer plus five wrong ones, shuffled.
export function derivativeQuestion(entry, derivatives) {
  const latin = latinKey(entry);
  const meaning = new Set(entry.english.toLowerCase().match(/[a-z]+/g) || []);
  const latinStart = latin.slice(0, 2);
  const byLatin = wrongAnswers(latinStart, latin, derivatives, meaning);

  // For each derivative: two more wrong answers that start like it and three
  // like the Latin word, so each start begins three of the six choices and
  // neither gives the answer away. Few English words start like some Latin
  // words (iubeō, iaciō), so the answer's start makes up any shortfall.
  const plans = derivatives.map(answer => {
    const start = answer.slice(0, 2);
    if (start === latinStart) return { answer, wrong: byLatin.slice(0, WRONG_ANSWERS), ok: true };
    const byAnswer = wrongAnswers(start, latin, derivatives, meaning);
    const wrong = [...byAnswer.slice(0, 2), ...byLatin.slice(0, 3)];
    for (const w of [...byAnswer.slice(2), ...byLatin.slice(3)]) {
      if (wrong.length < WRONG_ANSWERS) wrong.push(w);
    }
    return { answer, wrong, ok: byAnswer.length >= 2 };
  });
  const full = plans.filter(p => p.ok && p.wrong.length === WRONG_ANSWERS);
  const most = Math.max(...plans.map(p => p.wrong.length));
  const choices = full.length ? full : plans.filter(p => p.wrong.length === most);
  const { answer, wrong } = choices[Math.floor(Math.random() * choices.length)];

  // A few words have too few English words with either start (aqua, uxor):
  // fill in with words that share just the first letter.
  if (wrong.length < WRONG_ANSWERS) {
    const letters = [latin[0], answer[0]];
    const starts = Object.keys(DISTRACTORS).filter(s => letters.includes(s[0]) && s !== latinStart && s !== answer.slice(0, 2));
    for (const w of shuffle(starts.flatMap(s => wrongAnswers(s, latin, derivatives, meaning)))) {
      if (wrong.length < WRONG_ANSWERS && !wrong.includes(w)) wrong.push(w);
    }
  }
  return { answer, options: shuffle([answer, ...wrong]) };
}
