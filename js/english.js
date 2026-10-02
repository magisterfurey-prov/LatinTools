/* English translations of Latin verb forms, for the grammar charts'
   "translate each form" step. Built from each word's vocabulary meaning
   ("to love", "to take care of", "to be able, can") following the
   textbook's patterns for each tense:
     present       I love / I am loving / I do love
     imperfect     I was loving / I used to love / I kept (on) loving / I loved
     future        I will (shall) love
     perfect       I loved / I did love / I have loved
     pluperfect    I had loved
     future perf.  I will (shall) have loved
   and in the passive: I am loved, I was being loved, I will be loved,
   I was loved / have been loved, I had been loved, I will have been loved.
   Any meaning of the word is accepted. */

// English verbs that don't follow the regular -s / -ing / -ed patterns:
// [3rd person singular, -ing form, past, past participle]; empty slots use
// the regular rule, and "a|b" lists two accepted spellings.
const IRREGULAR = {
  have: ['has', 'having', 'had', 'had'],
  do: ['does', 'doing', 'did', 'done'],
  go: ['goes', 'going', 'went', 'gone'],
  say: ['says', 'saying', 'said', 'said'],
  see: ['sees', 'seeing', 'saw', 'seen'],
  flee: ['flees', 'fleeing', 'fled', 'fled'],
  lie: ['lies', 'lying', 'lay', 'lain'],
  give: [, , 'gave', 'given'], take: [, , 'took', 'taken'], hold: [, , 'held', 'held'],
  tell: [, , 'told', 'told'], think: [, , 'thought', 'thought'], teach: [, , 'taught', 'taught'],
  feel: [, , 'felt', 'felt'], seek: [, , 'sought', 'sought'], run: [, , 'ran', 'run'],
  understand: [, , 'understood', 'understood'], hear: [, , 'heard', 'heard'], know: [, , 'knew', 'known'],
  come: [, , 'came', 'come'], become: [, , 'became', 'become'], build: [, , 'built', 'built'],
  fight: [, , 'fought', 'fought'], drive: [, , 'drove', 'driven'], lead: [, , 'led', 'led'],
  burn: [, , 'burned|burnt', 'burned|burnt'], leave: [, , 'left', 'left'], send: [, , 'sent', 'sent'],
  make: [, , 'made', 'made'], put: [, , 'put', 'put'], choose: [, , 'chose', 'chosen'],
  meet: [, , 'met', 'met'], fall: [, , 'fell', 'fallen'], eat: [, , 'ate', 'eaten'],
  stand: [, , 'stood', 'stood'], read: [, , 'read', 'read'], feed: [, , 'fed', 'fed'],
  lose: [, , 'lost', 'lost'], throw: [, , 'threw', 'thrown'], sleep: [, , 'slept', 'slept'],
  wake: [, , 'woke|waked', 'woken|waked'], hide: [, , 'hid', 'hidden'], grow: [, , 'grew', 'grown'],
  sit: [, , 'sat', 'sat'], wear: [, , 'wore', 'worn'], find: [, , 'found', 'found'],
  write: [, , 'wrote', 'written'], burst: [, , 'burst', 'burst'], drink: [, , 'drank', 'drunk'],
  draw: [, , 'drew', 'drawn'], speak: [, , 'spoke', 'spoken'], bear: [, , 'bore', 'borne|born'],
  slide: [, , 'slid', 'slid'], steal: [, , 'stole', 'stolen'], keep: [, , 'kept', 'kept'],
  show: [, , 'showed', 'shown|showed'], break: [, , 'broke', 'broken'], tear: [, , 'tore', 'torn'],
  strike: [, , 'struck', 'struck|stricken'], thrust: [, , 'thrust', 'thrust'],
  learn: [, , 'learned|learnt', 'learned|learnt'], catch: [, , 'caught', 'caught'],
  dwell: [, , 'dwelt|dwelled', 'dwelt|dwelled'], get: [, , 'got', 'gotten|got'],
  begin: [, , 'began', 'begun'],
};
// Two-syllable verbs stressed on the last syllable double the final
// consonant (preferring); a few verbs are spelled either way (worship(p)ing).
const DOUBLE_FINAL = new Set(['prefer', 'admit', 'commit', 'occur', 'refer', 'regret', 'compel', 'expel', 'control', 'permit', 'omit', 'forget', 'begin']);
const EITHER_DOUBLING = new Set(['worship', 'marvel', 'travel', 'cancel', 'model', 'label', 'level', 'counsel']);

const MODALS = new Set(['ought', 'must', 'should', 'can']);
// Parts of a meaning a translation may leave off without changing what it
// says: a trailing prepositional phrase ("I distinguish" for "I distinguish
// with the eyes"), a directional particle ("I strike" for "I strike
// through"), the preposition after a noun or adjective ("I take care" for
// "I take care of", "I am eager" for "I am eager for"), and the preposition
// of wait for / care for / abound with. Phrasal meanings such as "look for",
// "come upon", and "be on fire" are kept whole.
const PREPOSITIONS = new Set(['of', 'for', 'at', 'to', 'with', 'in', 'on', 'upon', 'among', 'against', 'into', 'through', 'from', 'about']);
const DROPPABLE_PARTICLES = new Set(['into', 'through', 'among', 'to']);
const DROPPABLE_PREPOSITION_VERBS = new Set(['wait', 'care', 'abound']);

function alternatives(s) {
  return s.split('|');
}

function isConsonantY(base) {
  return /[^aeiou]y$/.test(base);
}

// Consonant-vowel-consonant monosyllables double the last letter (stop -> stopping).
function doublesFinal(base) {
  if (DOUBLE_FINAL.has(base)) return true;
  return /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(base);
}

function thirdSingular(base) {
  const irr = IRREGULAR[base];
  if (irr && irr[0]) return [irr[0]];
  if (/(s|x|z|ch|sh)$/.test(base)) return [base + 'es'];
  if (isConsonantY(base)) return [base.slice(0, -1) + 'ies'];
  return [base + 's'];
}

function withSuffix(base, suffix) {
  // suffix: 'ing' or 'ed'
  if (suffix === 'ed' && base.endsWith('e')) return [base + 'd'];
  if (suffix === 'ed' && isConsonantY(base)) return [base.slice(0, -1) + 'ied'];
  if (suffix === 'ing' && base.endsWith('ie')) return [base.slice(0, -2) + 'ying'];
  if (suffix === 'ing' && base.endsWith('e') && !/(ee|ye|oe)$/.test(base)) return [base.slice(0, -1) + 'ing'];
  const doubled = base + base.slice(-1) + suffix;
  if (EITHER_DOUBLING.has(base)) return [base + suffix, doubled];
  if (doublesFinal(base)) return [doubled];
  return [base + suffix];
}

function ingForm(base) {
  const irr = IRREGULAR[base];
  return irr && irr[1] ? [irr[1]] : withSuffix(base, 'ing');
}
function pastForm(base) {
  const irr = IRREGULAR[base];
  return irr && irr[2] ? alternatives(irr[2]) : withSuffix(base, 'ed');
}
function pastParticiple(base) {
  const irr = IRREGULAR[base];
  return irr && irr[3] ? alternatives(irr[3]) : withSuffix(base, 'ed');
}

// The meanings in a vocabulary gloss: { kind, head, rests }.
// kind: 'verb' (to love), 'be' (to be able), 'modal' (can, ought),
// 'not' (not to want). `rests` lists accepted endings ("care of", "care").
function meaningsOf(gloss) {
  const meanings = [];
  const cleaned = gloss.replace(/\([^)]*\)/g, ' ').replace(/“[^”]*”/g, ' ');
  for (const segment of cleaned.split(/[;,]/)) {
    let s = segment.trim().toLowerCase();
    if (!s || s.includes('–')) continue; // idiom notes such as "sē gerit – s/he/it behaves"
    s = s.replace(/^to\s+/, '').replace(/\b(somebody|someone|something)\b.*$/, '').trim();
    if (!s) continue;
    const words = s.split(/\s+/);
    let kind = 'verb';
    if (words[0] === 'not') { kind = 'not'; words.shift(); words[0] === 'to' && words.shift(); }
    else if (MODALS.has(words[0])) kind = 'modal';
    else if (words[0] === 'be') kind = 'be';
    const head = words[0];
    const rest = words.slice(1);
    const rests = new Set([rest.join(' ')]);
    const last = rest[rest.length - 1];
    if (kind === 'verb') {
      if (rest.length > 1 && PREPOSITIONS.has(rest[0])) rests.add('');                 // with the eyes, on or against
      if (rest.length === 1 && DROPPABLE_PARTICLES.has(rest[0])) rests.add('');         // drive into, go to
      if (rest.length === 1 && rest[0] !== 'to' && PREPOSITIONS.has(rest[0]) && DROPPABLE_PREPOSITION_VERBS.has(head)) rests.add('');
      if (rest.length === 1 && rest[0].endsWith('ly')) rests.add('');                    // esteem highly
    }
    if (rest.length > 1 && PREPOSITIONS.has(last) && !PREPOSITIONS.has(rest[0])) {
      rests.add(rest.slice(0, -1).join(' '));                                            // care of, eager for
    }
    meanings.push({ kind, head, rests: [...rests] });
  }
  return meanings;
}

const SUBJECTS = {
  sg1: ['i'], sg2: ['you'],
  sg3: ['he', 'she', 'it', 'he/she/it', 's/he/it', 's/he', 'he/she', 'he or she'],
  pl1: ['we'], pl2: ['you all', 'yall'], pl3: ['they'],
};
const BE_PRESENT = { sg1: 'am', sg2: 'are', sg3: 'is', pl1: 'are', pl2: 'are', pl3: 'are' };
const BE_PAST = { sg1: 'was', sg2: 'were', sg3: 'was', pl1: 'were', pl2: 'were', pl3: 'were' };
const HAVE = k => (k === 'sg3' ? 'has' : 'have');
const DO = k => (k === 'sg3' ? 'does' : 'do');
const WILL = k => (k === 'sg1' || k === 'pl1' ? ['will', 'shall'] : ['will']);

// Verb phrases (without the subject) for one meaning in one tense and voice.
function predicates(m, tense, voice, k) {
  const out = [];
  const add = (...parts) => {
    for (const rest of m.rests) out.push([...parts, rest].filter(Boolean).join(' '));
  };
  const each = (list, fn) => list.forEach(fn);

  if (m.kind === 'modal') {
    if (voice !== 'act') return out;
    if (tense === 'pres') { add(m.head); if (m.head === 'ought') add('ought to'); }
    if (m.head === 'can' && (tense === 'impf' || tense === 'perf')) add('could');
    if (m.head === 'must') {
      // dēbēbam "I had to", dēbēbō "I will have to"
      if (tense === 'impf' || tense === 'perf') add('had to');
      if (tense === 'fut') each(WILL(k), w => add(w, 'have to'));
      if (tense === 'plup') add('had had to');
      if (tense === 'futperf') each(WILL(k), w => add(w, 'have had to'));
    }
    return out;
  }

  if (m.kind === 'be') {
    // "to be able" -> I am able, I was able, I have been able ...
    if (voice !== 'act') return out;
    if (tense === 'pres') add(BE_PRESENT[k]);
    if (tense === 'impf') { add(BE_PAST[k]); add('used to be'); }
    if (tense === 'fut') each(WILL(k), w => add(w, 'be'));
    if (tense === 'perf') { add(BE_PAST[k]); add(HAVE(k), 'been'); }
    if (tense === 'plup') add('had been');
    if (tense === 'futperf') each(WILL(k), w => add(w, 'have been'));
    return out;
  }

  const base = m.head;
  if (m.kind === 'not') {
    // "not to know" -> I do not know, I did not know ...; in the passive the
    // "not" follows the first helping verb: I am not known, I will not be known.
    if (voice !== 'act') {
      return predicates({ ...m, kind: 'verb' }, tense, voice, k).map(p => p.replace(/^(\S+)/, '$1 not'));
    }
    if (tense === 'pres') { add(DO(k), 'not', base); each(ingForm(base), g => add(BE_PRESENT[k], 'not', g)); }
    if (tense === 'impf') { add('did not', base); each(ingForm(base), g => add(BE_PAST[k], 'not', g)); add('used not to', base); }
    if (tense === 'fut') each(WILL(k), w => add(w, 'not', base));
    if (tense === 'perf') { add('did not', base); each(pastParticiple(base), p => add(HAVE(k), 'not', p)); }
    if (tense === 'plup') each(pastParticiple(base), p => add('had not', p));
    if (tense === 'futperf') each(WILL(k), w => each(pastParticiple(base), p => add(w, 'not have', p)));
    return out;
  }

  if (voice === 'act') {
    if (tense === 'pres') {
      each(k === 'sg3' ? thirdSingular(base) : [base], f => add(f));
      each(ingForm(base), g => add(BE_PRESENT[k], g));
      add(DO(k), base);
    }
    if (tense === 'impf') {
      each(ingForm(base), g => { add(BE_PAST[k], g); add('kept on', g); add('kept', g); });
      add('used to', base);
      each(pastForm(base), p => add(p));
    }
    if (tense === 'fut') each(WILL(k), w => add(w, base));
    if (tense === 'perf') {
      each(pastForm(base), p => add(p));
      add('did', base);
      each(pastParticiple(base), p => add(HAVE(k), p));
    }
    if (tense === 'plup') each(pastParticiple(base), p => add('had', p));
    if (tense === 'futperf') each(WILL(k), w => each(pastParticiple(base), p => add(w, 'have', p)));
    return out;
  }

  // passive: I am loved, I was being loved, I will be loved, ...
  each(pastParticiple(base), p => {
    if (tense === 'pres') { add(BE_PRESENT[k], p); add(BE_PRESENT[k], 'being', p); }
    if (tense === 'impf') { add(BE_PAST[k], 'being', p); add('used to be', p); add(BE_PAST[k], p); }
    if (tense === 'fut') each(WILL(k), w => add(w, 'be', p));
    if (tense === 'perf') { add(BE_PAST[k], p); add(HAVE(k), 'been', p); }
    if (tense === 'plup') add('had been', p);
    if (tense === 'futperf') each(WILL(k), w => add(w, 'have been', p));
  });
  return out;
}

// Contractions a student might type, expanded before comparing.
const CONTRACTIONS = [
  [/\bcan['’]t\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bwon['’]t\b/g, 'will not'], [/\bshan['’]t\b/g, 'shall not'],
  [/n['’]t\b/g, ' not'], [/['’]m\b/g, ' am'], [/['’]re\b/g, ' are'], [/['’]ve\b/g, ' have'], [/['’]ll\b/g, ' will'],
];

// Lowercase, contractions expanded, punctuation and extra spaces removed.
// "'s" and "'d" are ambiguous (is/has, had/would), so they produce more than
// one candidate.
export function normalizeEnglish(text) {
  let s = (text || '').normalize('NFC').toLowerCase().trim();
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  let candidates = [s];
  if (/['’]s\b/.test(s)) candidates = [s.replace(/['’]s\b/g, ' is'), s.replace(/['’]s\b/g, ' has')];
  if (/['’]d\b/.test(s)) candidates = candidates.flatMap(c => [c.replace(/['’]d\b/g, ' had'), c.replace(/['’]d\b/g, ' would')]);
  return candidates.map(c => c
    .replace(/\s*\/\s*/g, '/')        // "he / she" -> "he/she"
    .replace(/['’]/g, '')             // y'all -> yall
    .replace(/[.,!?;:"“”()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

const PERSON_KEYS = ['sg1', 'sg2', 'sg3', 'pl1', 'pl2', 'pl3'];

// { sg1: Set, ... } of accepted (normalized) translations, or null when the
// word's meaning can't be put into this tense/voice in English.
export function translationsFor(entry, tense, voice) {
  const meanings = meaningsOf(entry.english || '');
  const result = {};
  for (const k of PERSON_KEYS) {
    const accepted = new Set();
    for (const m of meanings) {
      for (const pred of predicates(m, tense, voice, k)) {
        for (const subj of SUBJECTS[k]) accepted.add(`${subj} ${pred}`.replace(/\s+/g, ' ').trim());
      }
    }
    if (accepted.size === 0) return null;
    result[k] = accepted;
  }
  return result;
}

export function isAcceptedTranslation(text, accepted) {
  return normalizeEnglish(text).some(c => accepted.has(c));
}
