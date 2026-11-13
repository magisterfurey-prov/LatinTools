import { BOOK, loadChartVocab, linkParam, updateLink } from './book.js';
import {
  declineNoun, nounCategory, declineAdjective, adjectiveCategory, declineComparative, comparisonOf,
  pronounCategory, declinePronoun, conjugateVerb, verbCategory, verbHasForms, isIrregularVerb,
  presentParticiple, declineParticiple, gerundOf, PERFECT_TENSES, SUBJUNCTIVE_TENSES,
} from './morphology.js';
import { sameLatin, sameLatinRequireFinalMacron, insertAtCursor } from './util.js';
import { translationsFor, isAcceptedTranslation, nounTranslationsFor, isAcceptedNounTranslation } from './english.js';

const VOCAB = await loadChartVocab();

const MACRONS = ['ā', 'ē', 'ī', 'ō', 'ū'];
let lastFocusedInput = null;

const CASE_LABELS = { nom: 'Nominative', gen: 'Genitive', dat: 'Dative', acc: 'Accusative', abl: 'Ablative' };
const SHORT_CASES = { nom: 'Nom.', gen: 'Gen.', dat: 'Dat.', acc: 'Acc.', abl: 'Abl.' };
const CASES = ['nom', 'gen', 'dat', 'acc', 'abl'];

// Every chart, with the books it appears in. Level 2 charts draw on the
// vocabulary of both books (see loadChartVocab).
const CHARTS = [
  { group: 'Nouns', id: 'n-1st', label: '1st Declension Nouns', kind: 'noun', cat: '1st' },
  { group: 'Nouns', id: 'n-2nd-masc', label: '2nd Declension Nouns (Masc., -us)', kind: 'noun', cat: '2nd-masc' },
  { group: 'Nouns', id: 'n-2nd-neuter', label: '2nd Declension Nouns (Neuter)', kind: 'noun', cat: '2nd-neuter' },
  { group: 'Nouns', id: 'n-2nd-er', label: '2nd Declension Nouns (-er)', kind: 'noun', cat: '2nd-er' },
  { group: 'Nouns', id: 'n-3rd-masc', label: '3rd Declension Nouns (Masc.)', kind: 'noun', cat: '3rd-masc' },
  { group: 'Nouns', id: 'n-3rd-fem', label: '3rd Declension Nouns (Fem.)', kind: 'noun', cat: '3rd-fem' },
  { group: 'Nouns', id: 'n-3rd-neuter', label: '3rd Declension Nouns (Neuter)', kind: 'noun', cat: '3rd-neuter' },
  { group: 'Nouns', id: 'n-3rd-istem', label: '3rd Declension Nouns (i-stem)', kind: 'noun', cat: '3rd-istem' },
  { group: 'Nouns', id: 'n-4th', label: '4th Declension Nouns (Masc./Fem.)', kind: 'noun', cat: '4th' },
  { group: 'Nouns', id: 'n-4th-neuter', label: '4th Declension Nouns (Neuter)', kind: 'noun', cat: '4th-neuter' },
  { group: 'Nouns', id: 'n-5th', label: '5th Declension Nouns', kind: 'noun', cat: '5th' },
  { group: 'Adjectives', id: 'a-12', label: '1st/2nd Declension Adjectives', kind: 'adjective', cat: '12decl' },
  { group: 'Adjectives', id: 'a-3', label: '3rd Declension Adjectives', kind: 'adjective', cat: '3decl' },
  { group: 'Adjectives', id: 'a-pron', label: 'Adjectives with -īus Genitive (ūnus, sōlus, tōtus…)', kind: 'adjective', cat: 'pronominal', books: [2] },
  { group: 'Adjectives', id: 'a-comp', label: 'Comparative Adjectives', kind: 'comparative', books: [2] },
  { group: 'Adjectives', id: 'a-degrees', label: 'Comparison of Adjectives & Adverbs', kind: 'comparison', books: [2] },
  { group: 'Pronouns', id: 'p-dem', label: BOOK.id === 1 ? 'Demonstrative & Relative Pronouns (is, hic, ille, quī)' : 'Demonstrative, Intensive & Relative Pronouns', kind: 'pronoun' },
  { group: 'Verbs', id: 'v-1st', label: '1st Conjugation Verbs', kind: 'verb', cat: '1st' },
  { group: 'Verbs', id: 'v-2nd', label: '2nd Conjugation Verbs', kind: 'verb', cat: '2nd' },
  { group: 'Verbs', id: 'v-3rd', label: '3rd Conjugation Verbs', kind: 'verb', cat: '3rd' },
  { group: 'Verbs', id: 'v-3rdio', label: '3rd Conjugation -iō Verbs', kind: 'verb', cat: '3rd (-iō)' },
  { group: 'Verbs', id: 'v-4th', label: '4th Conjugation Verbs', kind: 'verb', cat: '4th' },
  { group: 'Verbs', id: 'v-dep', label: 'Deponent Verbs', kind: 'verb', cat: 'deponent', books: [2] },
  { group: 'Verbs', id: 'v-irr', label: BOOK.id === 1 ? 'sum and possum (Irregular)' : 'Irregular Verbs (sum, volō, eō, ferō, fīō…)', kind: 'verb', cat: 'irregular' },
  { group: 'Verbs', id: 'v-synopsis', label: 'Verb Synopsis', kind: 'synopsis', books: [2] },
  { group: 'Participles & Gerunds', id: 'pt-pres', label: 'Present Active Participles', kind: 'participle', books: [2] },
  { group: 'Participles & Gerunds', id: 'g-gerund', label: 'Gerunds', kind: 'gerund', books: [2] },
].filter(c => !c.books || c.books.includes(BOOK.id));

const TENSES = [
  ['pres', 'Present'], ['impf', 'Imperfect'], ['fut', 'Future'],
  ['perf', 'Perfect'], ['plup', 'Pluperfect'], ['futperf', 'Future Perfect'],
];
const VOICES = [['act', 'Active'], ['pass', 'Passive']];
const MOODS = [['ind', 'Indicative'], ['subj', 'Subjunctive']];

const chartPicker = document.getElementById('chartPicker');
const chartArea = document.getElementById('chartArea');

// A link can preselect the chart, its verb settings, and the word:
// grammar.html?chart=v-1st&tense=perf&voice=pass&word=amō
const openedAtChart = linkParam('chart') !== null;
let activeChart = CHARTS.find(c => c.id === linkParam('chart')) || CHARTS[0];
// Verb charts share one tense/voice/mood choice, kept while switching charts.
let verbMood = BOOK.id === 2 && linkParam('mood') === 'subj' ? 'subj' : 'ind';
let verbTense = TENSES.some(([v]) => v === linkParam('tense')) ? linkParam('tense') : 'pres';
if (verbMood === 'subj' && !SUBJUNCTIVE_TENSES.includes(verbTense)) verbTense = 'pres';
let verbVoice = linkParam('voice') === 'pass' ? 'pass' : 'act';
// Latin headword of the word last shown, so re-rendering keeps it selected.
let currentWord = linkParam('word');

// The verb synopsis (Level 2): one person and number of a verb in every mood, voice and tense the
// student picks before starting (all of them unless a link says otherwise):
// grammar.html?chart=v-synopsis&moods=ind&voices=act,pass&tenses=pres,perf&person=2pl&word=capiō
const PERSON_NUMBERS = [
  ['sg1', '1st Person Singular'], ['sg2', '2nd Person Singular'], ['sg3', '3rd Person Singular'],
  ['pl1', '1st Person Plural'], ['pl2', '2nd Person Plural'], ['pl3', '3rd Person Plural'],
];
function pickedFromLink(name, options) {
  const raw = linkParam(name);
  return raw === null ? options.map(([v]) => v) : options.map(([v]) => v).filter(v => raw.split(',').includes(v));
}
const linkedPerson = /^([123])(sg|pl)$/.exec(linkParam('person') || '');
const synopsis = {
  moods: pickedFromLink('moods', MOODS),
  voices: pickedFromLink('voices', VOICES),
  tenses: pickedFromLink('tenses', TENSES),
  person: linkedPerson ? linkedPerson[2] + linkedPerson[1] : 'sg3',
};

// The synopsis's columns for a verb: the picked voices, or a deponent's one set of forms.
function synopsisVoices(entry) {
  if (!synopsis.voices.length) return [];
  return entry.deponent ? [['pass', 'Deponent']] : VOICES.filter(([v]) => synopsis.voices.includes(v));
}
// The picked tenses a mood has: the subjunctive has no future or future perfect.
function synopsisTenses(mood) {
  return TENSES.filter(([t]) => synopsis.tenses.includes(t) && (mood === 'ind' || SUBJUNCTIVE_TENSES.includes(t)));
}
// Every form the synopsis asks for: { mood, tense, voice } per box.
function synopsisCells(entry) {
  return MOODS.filter(([m]) => synopsis.moods.includes(m)).flatMap(([mood]) =>
    synopsisTenses(mood).flatMap(([tense]) => synopsisVoices(entry).map(([voice]) => ({ mood, tense, voice }))));
}

// Level 1 has no subjunctive; sum and possum (Level 1's irregular chart)
// have no passive; deponents are always passive in form.
function activeMood() {
  return BOOK.id === 1 ? 'ind' : verbMood;
}
function activeVoice() {
  if (activeChart.cat === 'deponent') return 'pass';
  if (activeChart.cat === 'irregular' && BOOK.id === 1) return 'act';
  return verbVoice;
}

const VERB_LIKE = new Set(['verb', 'participle', 'gerund', 'synopsis']);

// Chapter of LFNM Level 1 that introduces each set of indicative forms.
function level1Chapter(conj, tense, voice) {
  if (conj === 'irregular') return { pres: 6, impf: 11, fut: 14, perf: 16, plup: 17, futperf: 18 }[tense];
  if (tense === 'pres') {
    if (voice === 'pass' && (conj === '1st' || conj === '2nd')) return 5;
    return { '1st': 2, '2nd': 2, '3rd': 8, '4th': 9, '3rd (-iō)': 10 }[conj];
  }
  if (tense === 'impf') return 11;
  if (tense === 'fut') return conj === '1st' || conj === '2nd' ? 14 : 15;
  return (voice === 'act' ? { perf: 16, plup: 17, futperf: 18 } : { perf: 19, plup: 20, futperf: 21 })[tense];
}

// Level 2 chapter for each subjunctive tense (Ch. 1-5).
function level2SubjunctiveChapter(conj, tense, voice) {
  if (tense === 'pres') return conj === '1st' || conj === 'sum' ? 1 : 2;
  if (tense === 'impf') return 3;
  return voice === 'act' ? 4 : 5;
}

const LEVEL1_PRONOUN_CHAPTER = { 'is': 12, 'quī': 14, 'hic': 19, 'ille': 20 };
const IRREGULAR_VERB_CHAPTER = { 'volō': 7, 'nōlō': 7, 'mālō': 7, 'ferō': 9, 'fīō': 9, 'eō': 10 };

// Where the textbook teaches what this chart practices, for the chosen word.
function chapterNote(chart, entry) {
  const head = entry.latin.split(',')[0].trim();
  if (BOOK.id === 1) {
    if (chart.kind === 'verb') return `Introduced in Chapter ${level1Chapter(chart.cat, verbTense, activeVoice())}`;
    if (chart.kind === 'pronoun') return `Introduced in Chapter ${LEVEL1_PRONOUN_CHAPTER[head]}`;
    return '';
  }
  const mood = activeMood();
  switch (chart.kind) {
    case 'verb': {
      if (chart.cat === 'deponent') return 'Introduced in Chapter 8';
      if (chart.cat === 'irregular') {
        if (head === 'sum' || head === 'possum') {
          return mood === 'ind'
            ? `Introduced in Level 1, Chapter ${level1Chapter('irregular', verbTense)}`
            : `Introduced in Chapter ${level2SubjunctiveChapter('sum', verbTense, 'act')}`;
        }
        return `Introduced in Chapter ${IRREGULAR_VERB_CHAPTER[head] || entry.chapter}`;
      }
      return mood === 'ind'
        ? `Introduced in Level 1, Chapter ${level1Chapter(chart.cat, verbTense, activeVoice())}`
        : `Introduced in Chapter ${level2SubjunctiveChapter(chart.cat, verbTense, activeVoice())}`;
    }
    case 'pronoun':
      return LEVEL1_PRONOUN_CHAPTER[head] ? `Introduced in Level 1, Chapter ${LEVEL1_PRONOUN_CHAPTER[head]}` : 'Introduced in Chapter 13';
    case 'adjective':
      return chart.cat === 'pronominal' ? 'Introduced in Chapter 11' : '';
    case 'comparative': return 'Introduced in Chapter 6 (irregular comparatives: Chapter 8)';
    case 'comparison': return 'Comparison: Chapters 6, 8, and 9 · Forming adverbs: Chapter 14';
    case 'participle': return 'Introduced in Chapter 11';
    case 'gerund': return 'Introduced in Chapter 15';
    default: return '';
  }
}

// Chapter 1 verbs are listed in the vocab data as their bare 3rd person
// singular form (e.g. "amat"), matching how the textbook itself introduces
// them before principal parts exist as a concept -- the same verb reappears
// in Chapter 2 under its real 1st sg. citation form ("amō"). A conjugation
// chart needs the real citation form, so exclude any verb entry whose
// headword isn't actually the 1st sg. present the chart itself would derive.
function isVerbCitationForm(entry) {
  const forms = conjugateVerb(entry);
  if (!forms) return false;
  return sameLatin(entry.latin, forms.sg1);
}

// The vocabulary repeats a few words in later chapters (parō, multus, sum);
// list each headword once.
function uniqueByLatin(words) {
  const seen = new Set();
  return words.filter(v => !seen.has(v.latin) && seen.add(v.latin));
}

// bonus, malus, māgnus, parvus, and multus appear in the comparative chart
// through their own comparatives (melior, pēior, ...), which are vocabulary words.
const IRREGULAR_POSITIVES = new Set(['bonus', 'malus', 'māgnus', 'parvus', 'multus']);

function comparativeNominatives(entry) {
  if (entry.declension === 'comparative') return entry.latin.split(',').map(s => s.trim());
  const c = comparisonOf(entry);
  return c ? c.comparative : null;
}

function wordsForChart(chart) {
  let words;
  switch (chart.kind) {
    case 'noun': words = VOCAB.filter(v => nounCategory(v) === chart.cat); break;
    case 'adjective': words = VOCAB.filter(v => adjectiveCategory(v) === chart.cat); break;
    case 'comparative':
      words = VOCAB.filter(v => adjectiveCategory(v) === 'comparative'
        || (comparisonOf(v) && !IRREGULAR_POSITIVES.has(comparisonOf(v).positive)));
      break;
    case 'comparison': words = VOCAB.filter(v => comparisonOf(v)); break;
    case 'pronoun': words = VOCAB.filter(v => pronounCategory(v)); break;
    case 'participle':
      words = VOCAB.filter(v => presentParticiple(v) && (isIrregularVerb(v) || isVerbCitationForm(v)));
      break;
    case 'gerund':
      words = VOCAB.filter(v => gerundOf(v) && (isIrregularVerb(v) || isVerbCitationForm(v)));
      break;
    case 'synopsis':
      // Only verbs that have every form picked: with the passive picked, no intransitive verbs or sum.
      words = VOCAB.filter(v => v.pos === 'Verb' && (isIrregularVerb(v) || isVerbCitationForm(v))
        && synopsisCells(v).length > 0
        && synopsisCells(v).every(c => verbHasForms(v, c.tense, c.voice, c.mood)));
      break;
    default: {
      const mood = activeMood();
      const voice = activeVoice();
      if (chart.cat === 'irregular') {
        const inChart = BOOK.id === 1 ? v => v.pos === 'Verb' && (v.latin === 'sum' || v.latin === 'possum') : isIrregularVerb;
        words = VOCAB.filter(v => inChart(v) && verbHasForms(v, verbTense, voice, mood));
      } else {
        words = VOCAB.filter(v => verbCategory(v) === chart.cat && isVerbCitationForm(v)
          && verbHasForms(v, verbTense, voice, mood));
      }
    }
  }
  return uniqueByLatin(words);
}

function optionsHTML(options, selected) {
  return options.map(([v, l]) => `<option value="${v}"${v === selected ? ' selected' : ''}>${l}</option>`).join('');
}

function chartTitle(chart) {
  if (chart.kind === 'synopsis') return `${chart.label} — ${PERSON_NUMBERS.find(([v]) => v === synopsis.person)[1]}`;
  if (chart.kind !== 'verb') return chart.label;
  const tense = TENSES.find(([v]) => v === verbTense)[1];
  const mood = BOOK.id === 2 ? ' ' + MOODS.find(([v]) => v === activeMood())[1] : '';
  const showVoice = chart.cat !== 'deponent' && !(chart.cat === 'irregular' && BOOK.id === 1);
  const voice = showVoice ? ' ' + VOICES.find(([v]) => v === activeVoice())[1] : '';
  return `${chart.label} — ${tense}${mood}${voice}`;
}

function tenseBarHTML(chart) {
  if (chart.kind !== 'verb') return '';
  const tenses = activeMood() === 'subj' ? TENSES.filter(([v]) => SUBJUNCTIVE_TENSES.includes(v)) : TENSES;
  const moodSel = BOOK.id === 2
    ? `<label for="moodSelect">Mood:</label><select id="moodSelect">${optionsHTML(MOODS, activeMood())}</select>`
    : '';
  let voiceSel;
  if (chart.cat === 'deponent') {
    voiceSel = '<span class="legend" style="margin:0;">Deponent: passive forms, active meaning</span>';
  } else {
    const disabled = chart.cat === 'irregular' && BOOK.id === 1 ? ' disabled title="sum and possum have no passive"' : '';
    voiceSel = `<label for="voiceSelect">Voice:</label><select id="voiceSelect"${disabled}>${optionsHTML(VOICES, activeVoice())}</select>`;
  }
  return `
    <div class="chart-toolbar">
      ${moodSel}
      <label for="tenseSelect">Tense:</label>
      <select id="tenseSelect">${optionsHTML(tenses, verbTense)}</select>
      ${voiceSel}
    </div>`;
}

function wireTenseBar() {
  const tenseSelect = document.getElementById('tenseSelect');
  if (!tenseSelect) return;
  tenseSelect.onchange = () => { verbTense = tenseSelect.value; renderChart(); };
  const voiceSelect = document.getElementById('voiceSelect');
  if (voiceSelect) voiceSelect.onchange = e => { verbVoice = e.target.value; renderChart(); };
  const moodSelect = document.getElementById('moodSelect');
  if (moodSelect) {
    moodSelect.onchange = e => {
      verbMood = e.target.value;
      // The subjunctive has no future or future perfect.
      if (verbMood === 'subj' && !SUBJUNCTIVE_TENSES.includes(verbTense)) verbTense = 'pres';
      renderChart();
    };
  }
}

// The synopsis's choices, made before writing: moods, voices, tenses, and the person and number.
function synopsisBarHTML(chart) {
  if (chart.kind !== 'synopsis') return '';
  const boxes = (name, options, picked) => options.map(([v, l]) =>
    `<label class="synopsis-pick"><input type="checkbox" name="${name}" value="${v}"${picked.includes(v) ? ' checked' : ''}> ${l}</label>`).join('');
  return `
    <div class="chart-toolbar synopsis-bar">
      <span class="synopsis-group"><strong>Mood:</strong> ${boxes('moods', MOODS, synopsis.moods)}</span>
      <span class="synopsis-group"><strong>Voice:</strong> ${boxes('voices', VOICES, synopsis.voices)}</span>
    </div>
    <div class="chart-toolbar synopsis-bar">
      <span class="synopsis-group"><strong>Tense:</strong> ${boxes('tenses', TENSES, synopsis.tenses)}</span>
    </div>
    <div class="chart-toolbar">
      <label for="personSelect">Person:</label>
      <select id="personSelect">${optionsHTML(PERSON_NUMBERS, synopsis.person)}</select>
    </div>`;
}

function wireSynopsisBar() {
  document.querySelectorAll('.synopsis-bar input[type="checkbox"]').forEach(box => {
    box.onchange = () => {
      synopsis[box.name] = [...document.querySelectorAll(`.synopsis-bar input[name="${box.name}"]:checked`)].map(b => b.value);
      renderChart();
    };
  });
  const person = document.getElementById('personSelect');
  if (person) person.onchange = () => { synopsis.person = person.value; renderChart(); };
}

function renderChartPicker() {
  chartPicker.innerHTML = '';
  const groups = [...new Set(CHARTS.map(c => c.group))];
  groups.forEach(group => {
    const label = document.createElement('div');
    label.style.cssText = 'width:100%;font-weight:600;color:var(--maroon-dark);margin-top:6px;';
    label.textContent = group;
    chartPicker.appendChild(label);
    CHARTS.filter(c => c.group === group).forEach(chart => {
      const chip = document.createElement('div');
      chip.className = 'chapter-chip' + (activeChart.id === chart.id ? ' selected' : '');
      chip.textContent = chart.label;
      chip.onclick = () => {
        activeChart = chart;
        renderChartPicker();
        renderChart();
      };
      chartPicker.appendChild(chip);
    });
  });
}

// Full citation form shown for a word: adds the genitive singular for nouns
// (needed to find the stem, especially for 3rd declension) and all principal
// parts for verbs (needed to find the present stem and know the conjugation).
function citationText(entry) {
  if (activeChart.kind === 'noun' && entry.genitive) return `${entry.latin}, ${entry.genitive}`;
  if (VERB_LIKE.has(activeChart.kind) && entry.principal_parts) return `${entry.latin}, ${entry.principal_parts}`;
  return entry.latin;
}

function wordLabel(entry) {
  return `${citationText(entry)} — ${entry.english}`;
}

function promptHTML(entry) {
  const meaning = `<span style="color:var(--ink-soft);">— ${entry.english}</span>`;
  if (activeChart.kind === 'noun' && entry.genitive) {
    return `<p><strong>${entry.latin}, ${entry.genitive}</strong> ${meaning} (genitive singular shown so you can find the stem)</p>`;
  }
  if (VERB_LIKE.has(activeChart.kind) && entry.principal_parts) {
    return `<p><strong>${entry.latin}, ${entry.principal_parts}</strong> ${meaning} (all principal parts shown so you can find the correct stem)</p>`;
  }
  if (activeChart.kind === 'comparative') {
    const [mf, n] = comparativeNominatives(entry);
    const of = entry.declension === 'comparative' ? '' : ` — comparative of <strong>${entry.latin}</strong>`;
    return `<p><strong>${mf}, ${n}</strong>${of} ${meaning}</p>`;
  }
  if (activeChart.kind === 'comparison' || activeChart.kind === 'pronoun' || activeChart.kind === 'adjective') {
    return `<p><strong>${entry.latin}</strong> ${meaning}</p>`;
  }
  return '';
}

// The word to show: the headword as given (full or just its first part,
// "bonus" for "bonus, bona, bonum"), macrons optional in a typed link.
function findWordIndex(words, wanted) {
  if (!wanted) return -1;
  const head = s => s.split(',')[0].trim();
  let i = words.findIndex(w => w.latin === wanted);
  if (i < 0) i = words.findIndex(w => head(w.latin) === head(wanted));
  if (i < 0) i = words.findIndex(w => sameLatin(head(w.latin), head(wanted)));
  return i;
}

function syncLink() {
  const verb = activeChart.kind === 'verb';
  const hasVoiceMenu = verb && activeChart.cat !== 'deponent' && !(activeChart.cat === 'irregular' && BOOK.id === 1);
  // A synopsis's picks, left out of the link when every one is picked.
  const syn = activeChart.kind === 'synopsis';
  const picks = (list, options) => (!syn || list.length === options.length ? null : list.join(',') || 'none');
  updateLink({
    chart: activeChart.id,
    mood: verb && BOOK.id === 2 ? activeMood() : null,
    tense: verb ? verbTense : null,
    voice: hasVoiceMenu ? activeVoice() : null,
    moods: picks(synopsis.moods, MOODS),
    voices: picks(synopsis.voices, VOICES),
    tenses: picks(synopsis.tenses, TENSES),
    person: syn ? synopsis.person.replace(/^(sg|pl)(\d)$/, '$2$1') : null,
    word: currentWord ? currentWord.split(',')[0].trim() : null,
  });
}

function renderChart() {
  const words = wordsForChart(activeChart);
  if (words.length === 0) {
    const message = activeChart.kind === 'synopsis'
      ? 'Pick at least one mood, voice, and tense. (The subjunctive has no future or future perfect.)'
      : 'No vocabulary words fit this chart yet.';
    chartArea.innerHTML = `<h2>${chartTitle(activeChart)}</h2>${tenseBarHTML(activeChart)}${synopsisBarHTML(activeChart)}
      <div class="empty-state">${message}</div>`;
    wireTenseBar();
    wireSynopsisBar();
    syncLink();
    return;
  }
  chartArea.innerHTML = `
    <h2>${chartTitle(activeChart)}</h2>
    ${tenseBarHTML(activeChart)}
    ${synopsisBarHTML(activeChart)}
    <div class="chart-toolbar">
      <label for="wordSelect">Word:</label>
      <select id="wordSelect"></select>
      <button id="checkBtn">Check My Work</button>
      <button class="secondary" id="clearBtn">Clear</button>
      <button class="secondary" id="randomBtn">Random Word</button>
    </div>
    <div class="chart-toolbar" id="macronBar">
      <span class="legend" style="margin:0;">Insert macron:</span>
    </div>
    <div id="wordPrompt"></div>
    <div id="tableWrap"></div>
    <div id="translateArea"></div>
    <div class="legend">${legendText(activeChart)}</div>
  `;

  wireTenseBar();
  wireSynopsisBar();
  const macronBar = document.getElementById('macronBar');
  MACRONS.forEach(ch => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'secondary latin';
    btn.style.padding = '4px 10px';
    btn.textContent = ch;
    btn.onclick = () => insertAtCursor(lastFocusedInput, ch);
    macronBar.appendChild(btn);
  });
  const select = document.getElementById('wordSelect');
  words.forEach((w, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = wordLabel(w);
    select.appendChild(opt);
  });

  function renderTableFor(entry) {
    currentWord = entry.latin;
    showLatinChart = () => renderTableFor(entry);
    document.getElementById('translateArea').innerHTML = '';
    const note = chapterNote(activeChart, entry);
    document.getElementById('wordPrompt').innerHTML = promptHTML(entry)
      + (note ? `<p class="legend" style="margin-top:-6px;">${note}</p>` : '');
    const wrap = document.getElementById('tableWrap');
    wrap.innerHTML = tableHTML(activeChart, entry);

    wrap.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('focus', () => { lastFocusedInput = inp; });
    });
    lastFocusedInput = wrap.querySelector('input');

    document.getElementById('checkBtn').onclick = () => checkChart(entry);
    document.getElementById('clearBtn').onclick = () => {
      wrap.querySelectorAll('input').forEach(inp => {
        inp.value = '';
        inp.parentElement.classList.remove('correct', 'incorrect');
      });
    };
    syncLink();
  }

  select.onchange = () => renderTableFor(words[select.value]);
  document.getElementById('randomBtn').onclick = () => {
    const idx = Math.floor(Math.random() * words.length);
    select.value = idx;
    renderTableFor(words[idx]);
  };

  const start = Math.max(0, findWordIndex(words, currentWord));
  select.value = start;
  renderTableFor(words[start]);
}

function legendText(chart) {
  const base = 'Green = correct, red = incorrect. Macrons (long marks) are optional';
  switch (chart.kind) {
    case 'verb': {
      let text = `${base}.`;
      if (PERFECT_TENSES.includes(verbTense) && (activeVoice() === 'pass' || chart.cat === 'irregular')) {
        text += ' For two-word forms, type both words — the participle and the form of sum (e.g. parātus est); any gender of the participle is accepted.';
      }
      return text;
    }
    case 'comparison':
      return `${base}. Give the masculine nominative singular of the comparative and superlative adjective.`;
    case 'participle':
      return `${base}. The ablative singular may end in -ī (as in the textbook's table) or -e (as in an ablative absolute).`;
    case 'gerund':
      return `${base}. The gerund has no nominative (the infinitive serves instead); its accusative is used after ad.`;
    case 'synopsis':
      return `${base}. For two-word forms, type both words — the participle and the form of sum (e.g. parātus est); any gender of the participle is accepted. A deponent has one column, since its forms are passive throughout.`;
    case 'comparative':
      return `${base}.`;
    case 'pronoun':
      return `${base} — except where a macron is the only difference between two forms in the chart (ea / eā, eadem / eādem), where it must be typed.`;
    default:
      break;
  }
  if (chart.cat === '4th') {
    return `${base} almost everywhere — except the -ūs endings (genitive singular, nominative and accusative plural), which need the macron to tell them apart from the nominative singular -us.`;
  }
  return `${base} almost everywhere — except the 1st declension ablative singular, which needs the macron on the final letter to tell it apart from the nominative singular.`;
}

// Cells where the macron is the only thing distinguishing the form from the
// nominative singular; returns how many final letters must match exactly.
function strictEndingLength(cat, c, n) {
  // 1st decl. abl. sg. "agricolā" vs. nom. sg. "agricola"
  if (cat === '1st' && c === 'abl' && n === 'sg') return 1;
  // 4th decl. "manūs" (gen. sg., nom./acc. pl.) vs. nom. sg. "manus"
  if (cat === '4th' && ((c === 'gen' && n === 'sg') || (n === 'pl' && (c === 'nom' || c === 'acc')))) return 2;
  return 0;
}

function tableHTML(chart, entry) {
  switch (chart.kind) {
    case 'noun': return nounTableHTML();
    case 'adjective': return chart.cat === '3decl' ? adj3TableHTML() : adj12TableHTML();
    case 'pronoun': return adj12TableHTML();
    case 'comparative':
    case 'participle': return adj3TableHTML();
    case 'comparison': return comparisonTableHTML(entry);
    case 'gerund': return gerundTableHTML();
    case 'synopsis': return synopsisTableHTML(entry);
    default: return verbTableHTML();
  }
}

// One table per picked mood: a row per tense, a column per voice. Tense names shorten on
// phones (Plup.) to leave room for two-word forms like captī essent.
const SHORT_TENSES = { pres: 'Pres.', impf: 'Impf.', fut: 'Fut.', perf: 'Perf.', plup: 'Plup.', futperf: 'Fut. Perf.' };
function synopsisTableHTML(entry) {
  const voices = synopsisVoices(entry);
  return MOODS.filter(([m]) => synopsis.moods.includes(m)).map(([mood, moodLabel]) => {
    const tenses = synopsisTenses(mood);
    if (!tenses.length) return `<p class="legend">The subjunctive has no future or future perfect.</p>`;
    const rows = tenses.map(([tense, tenseLabel]) => `
      <tr>
        <td class="case-label"><span class="label-full">${tenseLabel}</span><span class="label-short">${SHORT_TENSES[tense]}</span></td>
        ${voices.map(([voice, voiceLabel]) => `<td><input data-mood="${mood}" data-tense="${tense}" data-voice="${voice}"
          autocomplete="off" spellcheck="false" aria-label="${tenseLabel} ${voiceLabel} ${moodLabel}"></td>`).join('')}
      </tr>`).join('');
    return `<h3 class="synopsis-mood">${moodLabel}</h3>
      <table class="chart synopsis-chart"><tr><th></th>${voices.map(([, l]) => `<th>${l}</th>`).join('')}</tr>${rows}</table>`;
  }).join('');
}

function nounTableHTML() {
  let rows = CASES.map(c => `
    <tr>
      <td class="case-label">${CASE_LABELS[c]}</td>
      <td><input data-case="${c}" data-num="sg" autocomplete="off" spellcheck="false"></td>
      <td><input data-case="${c}" data-num="pl" autocomplete="off" spellcheck="false"></td>
    </tr>`).join('');
  return `<table class="chart"><tr><th></th><th>Singular</th><th>Plural</th></tr>${rows}</table>`;
}

// One column per gender, with the singular fields on top and the plural fields underneath, the way
// the textbook sets out an adjective. The -īus adjectives and the pronouns have the same shape.
// On phones the case and gender names shorten (Nom., Masc.) so that the three columns fit.
function adj12TableHTML() {
  const genders = [['M', 'Masculine', 'Masc.'], ['F', 'Feminine', 'Fem.'], ['N', 'Neuter', 'Neut.']];
  const named = (full, short) => `<span class="label-full">${full}</span><span class="label-short">${short}</span>`;
  const block = (num, label) => `
    <tr class="number-row"><th colspan="${genders.length + 1}">${label}</th></tr>${CASES.map(c => `
    <tr>
      <td class="case-label">${named(CASE_LABELS[c], SHORT_CASES[c])}</td>${genders.map(([g]) => `
      <td><input data-case="${c}" data-gender="${g}" data-num="${num}"></td>`).join('')}
    </tr>`).join('')}`;
  return `<table class="chart gender-chart"><tr><th></th>${genders.map(([, name, short]) => `<th>${named(name, short)}</th>`).join('')}</tr>${block('sg', 'Singular')}${block('pl', 'Plural')}</table>`;
}

// 3rd declension (and comparatives, participles): M/F identical, so combined.
function adj3TableHTML() {
  let rows = CASES.map(c => `
    <tr>
      <td class="case-label">${CASE_LABELS[c]}</td>
      <td><input data-case="${c}" data-gender="M" data-num="sg"></td>
      <td><input data-case="${c}" data-gender="N" data-num="sg"></td>
      <td><input data-case="${c}" data-gender="M" data-num="pl"></td>
      <td><input data-case="${c}" data-gender="N" data-num="pl"></td>
    </tr>`).join('');
  return `<table class="chart"><tr><th></th><th>M/F (sg)</th><th>N (sg)</th><th>M/F (pl)</th><th>N (pl)</th></tr>${rows}</table>`;
}

function verbTableHTML() {
  const rows = [1, 2, 3].map(p => `
    <tr>
      <td class="case-label">${p}${p === 1 ? 'st' : p === 2 ? 'nd' : 'rd'} person</td>
      <td><input data-person="${p}" data-num="sg"></td>
      <td><input data-person="${p}" data-num="pl"></td>
    </tr>`).join('');
  return `<table class="chart"><tr><th></th><th>Singular</th><th>Plural</th></tr>${rows}</table>`;
}

function comparisonTableHTML(entry) {
  const c = comparisonOf(entry);
  const adverbRow = c.adverbs
    ? `<td><input data-slot="adv-pos"></td><td><input data-slot="adv-comp"></td><td><input data-slot="adv-sup"></td>`
    : '<td colspan="3" class="legend" style="text-align:center;">(no common adverb)</td>';
  return `<table class="chart">
    <tr><th></th><th>Positive</th><th>Comparative</th><th>Superlative</th></tr>
    <tr><td class="case-label">Adjective</td><td class="latin">${c.positive}</td>
      <td><input data-slot="adj-comp"></td><td><input data-slot="adj-sup"></td></tr>
    <tr><td class="case-label">Adverb</td>${adverbRow}</tr>
  </table>`;
}

function gerundTableHTML() {
  const rows = [['gen', 'Genitive'], ['dat', 'Dative'], ['acc', 'Accusative (ad …)'], ['abl', 'Ablative']].map(([c, l]) => `
    <tr><td class="case-label">${l}</td><td><input data-case="${c}"></td></tr>`).join('');
  return `<table class="chart"><tr><th></th><th>Gerund</th></tr>${rows}</table>`;
}

// Forms that differ from another form in the same chart only by macrons
// (ea / eā) must be typed exactly.
function macronTwins(forms) {
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const all = [];
  for (const g of ['M', 'F', 'N']) for (const n of ['sg', 'pl']) for (const c of CASES) all.push(forms[g][n][c]);
  const flat = all.flat();
  return new Set(flat.filter(f => flat.some(o => o !== f && strip(o) === strip(f))));
}

function checkChart(entry) {
  const wrap = document.getElementById('tableWrap');
  const inputs = wrap.querySelectorAll('input');
  switch (activeChart.kind) {
    case 'noun': {
      const forms = declineNoun(entry);
      inputs.forEach(inp => {
        const c = inp.dataset.case, n = inp.dataset.num;
        markCell(inp, forms[n][c], strictEndingLength(activeChart.cat, c, n));
      });
      offerTranslation(entry, Object.fromEntries(['sg', 'pl'].flatMap(n => CASES.map(c => [`${n}-${c}`, forms[n][c]]))));
      return;
    }
    case 'adjective':
    case 'comparative':
    case 'participle':
    case 'pronoun': {
      let result;
      if (activeChart.kind === 'comparative') result = declineComparative(...comparativeNominatives(entry));
      else if (activeChart.kind === 'participle') result = declineParticiple(entry);
      else if (activeChart.kind === 'pronoun') result = declinePronoun(entry);
      else result = declineAdjective(entry);
      const twins = activeChart.kind === 'pronoun' ? macronTwins(result.forms) : new Set();
      inputs.forEach(inp => {
        const c = inp.dataset.case, n = inp.dataset.num, g = inp.dataset.gender;
        const expected = result.forms[g][n][c];
        if (twins.has(expected)) return markCell(inp, expected, expected.length);
        // Same 1st-declension ambiguity, but only the feminine column uses the
        // "-a"/"-ā" pattern (masc./neut. abl. sg. is "-ō", never ambiguous).
        const strict = (activeChart.cat === '12decl' || activeChart.cat === 'pronominal') && g === 'F' && c === 'abl' && n === 'sg';
        markCell(inp, expected, strict ? 1 : 0);
      });
      return;
    }
    case 'comparison': {
      const c = comparisonOf(entry);
      const expected = {
        'adj-comp': c.comparative[0], 'adj-sup': c.superlative,
        ...(c.adverbs ? { 'adv-pos': c.adverbs[0], 'adv-comp': c.adverbs[1], 'adv-sup': c.adverbs[2] } : {}),
      };
      inputs.forEach(inp => markCell(inp, expected[inp.dataset.slot]));
      return;
    }
    case 'gerund': {
      const forms = gerundOf(entry);
      inputs.forEach(inp => markCell(inp, forms[inp.dataset.case]));
      return;
    }
    case 'synopsis': {
      inputs.forEach(inp => {
        const { mood, tense, voice } = inp.dataset;
        markCell(inp, conjugateVerb(entry, tense, voice, mood)[synopsis.person]);
      });
      const allRight = [...inputs].every(inp => inp.parentElement.classList.contains('correct'));
      document.getElementById('translateArea').innerHTML = allRight ? '<div class="translate-offer">✓ All correct!</div>' : '';
      return;
    }
    default: {
      const forms = conjugateVerb(entry, verbTense, activeVoice(), activeMood());
      inputs.forEach(inp => {
        const p = inp.dataset.person, n = inp.dataset.num;
        markCell(inp, forms[n === 'sg' ? 'sg' + p : 'pl' + p]);
      });
      offerTranslation(entry, forms);
    }
  }
}

// ---------- Translating a correctly filled-in verb or noun chart ----------
// After every form in a verb or noun chart is right, the student can
// translate each form into English (any meaning of the word, in any of the
// textbook's translations for that tense or case -- see js/english.js).

// Re-shows the Latin chart for the current word (set by renderTableFor).
let showLatinChart = () => {};

const PERSON_LABELS = { 1: '1st', 2: '2nd', 3: '3rd' };
const TRANSLATION_PATTERNS = {
  'pres-act': 'I ___ / I am ___ing / I do ___',
  'impf-act': 'I was ___ing / I used to ___ / I kept (on) ___ing — or the simple past, I ___ed',
  'fut-act': 'I will (shall) ___',
  'perf-act': 'I ___ed / I did ___ / I have ___ed',
  'plup-act': 'I had ___ed',
  'futperf-act': 'I will (shall) have ___ed',
  'pres-pass': 'I am ___ed / I am being ___ed',
  'impf-pass': 'I was being ___ed / I used to be ___ed',
  'fut-pass': 'I will (shall) be ___ed',
  'perf-pass': 'I was ___ed / I have been ___ed',
  'plup-pass': 'I had been ___ed',
  'futperf-pass': 'I will (shall) have been ___ed',
};

// Deponents are passive in form but active in meaning.
function translationVoice() {
  return activeChart.cat === 'deponent' ? 'act' : activeVoice();
}

// Every meaning the vocabulary gives the word, including entries that list
// it again with another meaning (gerō "to carry" / "to wear").
function glossFor(entry) {
  return VOCAB.filter(v => v.pos === entry.pos && v.latin === entry.latin).map(v => v.english).join('; ');
}

// The keys english.js uses: sg1 ... pl3 for verbs, sg-nom ... pl-abl for nouns.
function cellKey(inp) {
  return inp.dataset.case ? `${inp.dataset.num}-${inp.dataset.case}` : inp.dataset.num + inp.dataset.person;
}

function offerTranslation(entry, forms) {
  const area = document.getElementById('translateArea');
  area.innerHTML = '';
  const inputs = [...document.querySelectorAll('#tableWrap input')];
  if (!inputs.length || !inputs.every(i => i.parentElement.classList.contains('correct'))) return;
  const isNoun = activeChart.kind === 'noun';
  if (!isNoun && activeMood() === 'subj') {
    area.innerHTML = `<div class="translate-offer">✓ All correct! <span class="legend" style="margin:0;">(There's no translation step for the subjunctive: its English depends on the clause it's in.)</span></div>`;
    return;
  }
  const meaning = { english: glossFor(entry) };
  const translations = isNoun ? nounTranslationsFor(meaning) : translationsFor(meaning, verbTense, translationVoice());
  if (!translations) {
    area.innerHTML = '<div class="translate-offer">✓ All correct!</div>';
    return;
  }
  // The student's own (correct) Latin picks which accepted form to show,
  // e.g. parāta sum rather than parātus sum.
  const typed = Object.fromEntries(inputs.map(inp => [cellKey(inp), inp.value]));
  const shown = Object.fromEntries(Object.entries(forms).map(([k, f]) => [k,
    Array.isArray(f) ? (f.find(x => sameLatin(typed[k], x)) || f[0]) : f]));
  area.innerHTML = `<div class="translate-offer">✓ All correct! Now try translating each form into English.
    <button id="translateBtn">Translate the forms</button></div>`;
  document.getElementById('translateBtn').onclick = () => startTranslation(shown, translations);
}

function startTranslation(shown, translations) {
  const isNoun = activeChart.kind === 'noun';
  const wrap = document.getElementById('tableWrap');
  const cell = key => `
    <div class="translate-cell">
      <span class="latin translate-latin">${shown[key]}</span>
      <input data-key="${key}" placeholder="English" autocomplete="off" spellcheck="false" aria-label="English for ${shown[key]}">
    </div>`;
  // [row label, the row's cell key for a number]; case names shorten on
  // phones (Nom., Gen., ...) to leave room for long forms like fortitūdinibus.
  const rowSpecs = isNoun
    ? CASES.map(c => [`<span class="label-full">${CASE_LABELS[c]}</span><span class="label-short">${CASE_LABELS[c].slice(0, 3)}.</span>`, n => `${n}-${c}`])
    : [1, 2, 3].map(p => [`${PERSON_LABELS[p]} person`, n => n + p]);
  const rows = rowSpecs.map(([label, key]) => `
    <tr>
      <td class="case-label">${label}</td>
      <td>${cell(key('sg'))}</td>
      <td>${cell(key('pl'))}</td>
    </tr>`).join('');
  wrap.innerHTML = `<table class="chart translate-chart"><tr><th></th><th>Singular</th><th>Plural</th></tr>${rows}</table>`;
  // Noun charts leave the case patterns (of the ___, to/for the ___, ...) for
  // students to recall themselves.
  const hint = isNoun
    ? 'Type an English translation of each form, using any meaning of the word.'
    : `Type an English translation of each form, using any meaning of the word: <strong>${TRANSLATION_PATTERNS[`${verbTense}-${translationVoice()}`]}</strong>.
      For the 3rd person singular use <em>he</em>, <em>she</em>, or <em>it</em>; for the 2nd person plural use <em>you all</em> or <em>y'all</em>.`;
  document.getElementById('translateArea').innerHTML = `
    <p class="legend">${hint}</p>
    <div id="translateResult"></div>
    <button class="secondary" id="backToChartBtn">Back to the Latin chart</button>`;
  document.getElementById('backToChartBtn').onclick = () => showLatinChart();

  const inputs = [...wrap.querySelectorAll('input')];
  inputs.forEach(inp => inp.addEventListener('focus', () => { lastFocusedInput = inp; }));
  inputs[0].focus();
  document.getElementById('checkBtn').onclick = () => checkTranslations(inputs, translations);
  document.getElementById('clearBtn').onclick = () => {
    inputs.forEach(inp => { inp.value = ''; inp.closest('td').classList.remove('correct', 'incorrect'); });
    document.getElementById('translateResult').innerHTML = '';
  };
}

function checkTranslations(inputs, translations) {
  const accepts = activeChart.kind === 'noun' ? isAcceptedNounTranslation : isAcceptedTranslation;
  let right = 0;
  inputs.forEach(inp => {
    const td = inp.closest('td');
    td.classList.remove('correct', 'incorrect');
    if (!inp.value.trim()) return;
    const ok = accepts(inp.value, translations[inp.dataset.key]);
    td.classList.add(ok ? 'correct' : 'incorrect');
    if (ok) right++;
  });
  document.getElementById('translateResult').innerHTML = right === inputs.length
    ? `<div class="translate-offer">🎉 All ${inputs.length} translations are correct!</div>`
    : '';
}

function markCell(inp, expected, strictEndingLen = 0) {
  const td = inp.parentElement;
  td.classList.remove('correct', 'incorrect');
  if (!inp.value.trim()) {
    return; // leave blank cells unmarked
  }
  // `expected` may list several right answers (parātus / parāta / parātum est).
  const accepted = Array.isArray(expected) ? expected : [expected];
  const ok = accepted.some(e => (strictEndingLen
    ? sameLatinRequireFinalMacron(inp.value, e, strictEndingLen)
    : sameLatin(inp.value, e)));
  if (ok) td.classList.add('correct');
  else td.classList.add('incorrect');
}

renderChartPicker();
renderChart();
// Opened from a link to a particular chart: start at the chart, below the picker.
if (openedAtChart) chartArea.scrollIntoView();
