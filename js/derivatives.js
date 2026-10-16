// Derivative Practice: each question shows a Latin word and offers one of its
// English derivatives (from the vocabulary's derivatives list) among five
// English words that start with the same three letters as the right answer or
// one of the Latin word's forms (two letters, or one, where there aren't
// enough). A second step then asks what that derivative means.
import { DISTRACTORS, FROM_LATIN } from '../data/derivative-distractors.js';
import { DEFINITIONS } from '../data/derivative-definitions.js';
import { normalizeLatin, shuffle } from './util.js';

const WRONG_ANSWERS = 5;
const lettersOf = text => normalizeLatin(text).replace(/[^a-z]/g, '');

// The Latin headword without macrons, notes, or "+ accusative":
// "ante + accusative" -> "ante", "dūcō" -> "duco".
function latinKey(entry) {
  return lettersOf(entry.latin.split(/[,(+]/)[0]);
}

// The forms shown for the word ("videō, vidēre, vīdī, vīsum") as plain
// letters, without notes ("+ accusative") or missing parts ("——"); alō's
// "altum/alitum" is two forms.
function formsOf(shown) {
  return shown.replace(/\([^)]*\)/g, '').replace(/\+.*$/, '').split(/[,/]/)
    .map(part => lettersOf(part.trim().split(/\s+/)[0]))
    .filter(form => form.length > 1);
}

const startsOf = (forms, length) => [...new Set(forms.filter(f => f.length >= length).map(f => f.slice(0, length)))];
const piecesOf = form => Array.from({ length: form.length - 3 }, (_, i) => form.slice(i, i + 4));

// The definition shown as a hint after a wrong answer.
export function definitionOf(word) {
  return DEFINITIONS[word] || DISTRACTORS[word.slice(0, 2)]?.[word] || '';
}

// Pool words with one of these starts that can't pass for a derivative of
// the Latin word: none that shares four letters with one of its derivatives
// (arrow for rogō, which has arrogate) or has four letters in a row from one
// of its forms (deposit for pōnō, positum), none that translates it (land for
// terra), and no Latin-derived word that comes from it (see FROM_LATIN).
function poolWords(starts, latin) {
  return shuffle(starts.flatMap(start =>
    Object.keys(DISTRACTORS[start.slice(0, 2)] || {}).filter(word => word.startsWith(start))))
    .filter(word => !latin.derivatives.some(d => d.slice(0, 4) === word.slice(0, 4))
      && !latin.pieces.some(piece => word.includes(piece))
      && !latin.meaning.has(word)
      && !FROM_LATIN[word]?.includes(latin.key));
}

// The right answer plus five wrong ones, shuffled. `shown` is the Latin as the
// page shows it, with the genitive or principal parts.
export function derivativeQuestion(entry, derivatives, shown) {
  const forms = formsOf(shown);
  const latin = {
    key: latinKey(entry), derivatives,
    meaning: new Set(entry.english.toLowerCase().match(/[a-z]+/g) || []),
    pieces: [...new Set(forms.flatMap(piecesOf))],
  };
  const latinWords = [...poolWords(startsOf(forms, 3), latin), ...poolWords(startsOf(forms, 2), latin)];

  // For each derivative: two wrong answers that start like it and three like
  // the Latin forms, so the right answer's start is never the odd one out,
  // each sharing three letters where there are enough words and two where
  // not. Few English words start like some Latin words (iubeō, iaciō), so the
  // answer's start makes up any shortfall.
  const plans = derivatives.map(answer => {
    const start = lettersOf(answer);
    const answerWords = [...poolWords([start.slice(0, 3)], latin), ...poolWords([start.slice(0, 2)], latin)];
    const wrong = [];
    const take = (words, count) => {
      for (const word of words) if (wrong.length < count && !wrong.includes(word)) wrong.push(word);
    };
    take(answerWords, 2);
    const balanced = wrong.length === 2;
    take(latinWords, WRONG_ANSWERS);
    take(answerWords, WRONG_ANSWERS);
    const threeLetterStarts = [start.slice(0, 3), ...startsOf(forms, 3)];
    const threeLetter = wrong.filter(word => threeLetterStarts.includes(word.slice(0, 3))).length;
    return { answer, wrong, balanced, threeLetter };
  });
  // A balanced plan with all five if there is one, and of those, one with the
  // most wrong answers that share three letters, or one fewer, so that a word
  // with several derivatives doesn't always ask for the same one.
  const full = plans.filter(p => p.balanced && p.wrong.length === WRONG_ANSWERS);
  const most = Math.max(...plans.map(p => p.wrong.length));
  const candidates = full.length ? full : plans.filter(p => p.wrong.length === most);
  const best = Math.max(...candidates.map(p => p.threeLetter));
  const choices = candidates.filter(p => p.threeLetter >= best - 1);
  const { answer, wrong } = choices[Math.floor(Math.random() * choices.length)];

  // A few words have too few English words with any of these starts (aqua,
  // uxor): fill in with words that share just the first letter.
  if (wrong.length < WRONG_ANSWERS) {
    const firsts = [latin.key[0], answer[0], ...forms.map(f => f[0])];
    for (const word of poolWords(Object.keys(DISTRACTORS).filter(s => firsts.includes(s[0])), latin)) {
      if (wrong.length < WRONG_ANSWERS && !wrong.includes(word)) wrong.push(word);
    }
  }
  return { answer, options: shuffle([answer, ...wrong]) };
}

// ---- The meaning step ----

// Words that say nothing about a meaning, including the grammar notes in some
// vocabulary meanings ("+ genitive").
const FUNCTION_WORDS = new Set((
  'an the of or to and in on for with by from as at that which who whom whose is are be been being it its '
  + 'into onto not no very too such than more most much many some any other own so up he she his her him '
  + 'they them their you your we our us me my etc eg ie usually especially often certain somebody someone '
  + 'something anyone anything acc dat abl gen inf pl genitive dative ablative accusative interrogative '
  + 'pronoun already know meaning means').split(' '));
// The wording definitions have in common ("a person who", "having to do
// with"), which a wrong definition may share with the right one.
const BOILERPLATE = new Set((
  'having relating related pertaining connected concerning do does done doing use used using make made '
  + 'making like kind way manner act state quality condition person thing things able capable tending one').split(' '));
const PLURALS = { men: 'man', women: 'woman', children: 'child', feet: 'foot', teeth: 'tooth', people: 'person' };
// Words close enough in meaning that a definition using one could pass for a
// definition using another ("of the sea" for aquatic, from aqua "water").
const CLOSE_WORDS = [
  'earth land ground soil world', 'sea ocean water', 'love fond affection',
  'see sight view look watch eye', 'say speak speech talk tell word voice', 'walk go move travel journey',
  'war battle fight soldier army military', 'king queen royal rule ruler reign', 'city town',
  'friend friendly', 'kill death dead die', 'life live alive', 'man human person', 'god divine',
  'father mother parent', 'son daughter child', 'house home dwell', 'fire flame burn',
  'light bright shine', 'write letter', 'fear afraid', 'anger angry rage', 'faith trust belief',
  'free freedom liberty', 'teach learn', 'work labor', 'farm agriculture field',
  'ship sailor boat navigation', 'star sky heaven', 'law legal', 'mind think thought reason',
  'money wealth rich', 'good well', 'bad evil wicked',
].map(group => group.split(' '));

function wordsOf(text, keepBoilerplate) {
  return (normalizeLatin(text).match(/[a-z]+/g) || [])
    .map(w => PLURALS[w] || w)
    .filter(w => w.length > 1 && !FUNCTION_WORDS.has(w) && (keepBoilerplate || !BOILERPLATE.has(w)));
}

// "love" matches "loving" and "lover"; "land" matches "lands".
function sameWord(a, b) {
  let p = 0;
  while (p < a.length && a[p] === b[p]) p++;
  const shorter = Math.min(a.length, b.length);
  return p >= 4 || p === shorter || (p >= 3 && shorter <= 4);
}
const shareWords = (a, b) => a.some(x => b.some(y => sameWord(x, y)));
const withCloseWords = words => [...words, ...CLOSE_WORDS.filter(group => shareWords(group, words)).flat()];

// A definition's form, so the wrong ones can match the right one: a verb's
// ("to …"), a noun's ("a …", or "self-denial" for abnegation, known by the
// word's ending), or a description ("bitter and caustic in temper").
const NOUN_ENDINGS = /(tion|sion|ity|ty|ment|ance|ence|ancy|ency|ism|ist|ure|tude|ness|ship|dom|cy|ery)$/;
const NOT_NOUNS = new Set(['vehement']);
// Nouns defined without an article whose endings don't give them away.
const BARE_NOUNS = new Set([
  'adieu', 'agronomy', 'altimeter', 'annals', 'artifice', 'boon', 'consensus', 'cuneiform', 'demise',
  'denominative', 'disrepute', 'domicile', 'dominion', 'dowry', 'flux', 'gentry', 'herbage', 'ignominy',
  'ire', 'malady', 'malefactor', 'modus operandi', 'modus vivendi', 'mores', 'mortician', 'novice',
  'obloquy', 'omnibus', 'portal', 'precursor', 'premium', 'realia', 'refuge', 'surfeit', 'tact', 'tenant',
  'tenet', 'terra firma', 'transom', 'tumult', 'tutelage', 'uxoricide', 'via media', 'victuals', 'vim',
  'visage',
]);
function formOf(word, definition) {
  const core = definition.replace(/^in [^,]+, /, ''); // "in politics, an extreme conservative"
  if (/^to /.test(core)) return 'verb';
  if (/^(a|an|the|one|someone|something|anyone|anything|any) /.test(core) || BARE_NOUNS.has(word)
    || (NOUN_ENDINGS.test(word) && !NOT_NOUNS.has(word))) return 'noun';
  return 'description';
}

const DEFINED = Object.entries(DEFINITIONS).map(([word, definition]) => ({
  word, definition, form: formOf(word, definition),
  words: wordsOf(definition, false), allWords: wordsOf(definition, true),
}));

// The derivative's definition among five definitions of other derivatives, in
// the same form where there are enough, so grammar doesn't give it away. None
// comes from the same Latin word or shares a word with the right definition or
// the Latin word's meaning (or a word close to one), so a student who knows the
// Latin word can tell which fits; and no two share a word with each other.
export function meaningQuestion(entry, derivatives, answer) {
  const right = definitionOf(answer);
  const avoid = withCloseWords(wordsOf(right, false));
  const meaning = withCloseWords(wordsOf(entry.english, true));
  const pool = shuffle(DEFINED.filter(d =>
    !derivatives.some(x => x.slice(0, 4) === d.word.slice(0, 4) || definitionOf(x) === d.definition)
    && !shareWords(d.words, avoid)
    && !shareWords(d.allWords, meaning)));
  const form = formOf(answer, right);
  const wrong = [];
  for (const d of [...pool.filter(d => d.form === form), ...pool]) {
    if (wrong.length < WRONG_ANSWERS && !wrong.some(w => w.definition === d.definition || shareWords(w.words, d.words))) wrong.push(d);
  }
  return { answer: right, options: shuffle([right, ...wrong.map(d => d.definition)]) };
}
