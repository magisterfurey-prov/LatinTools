import { BOOK, loadChartVocab } from './book.js';
import {
  declineNoun, nounCategory, declineAdjective, adjectiveCategory, declineComparative, comparisonOf,
  pronounCategory, declinePronoun, conjugateVerb, verbCategory, verbHasForms, isIrregularVerb,
  presentParticiple, declineParticiple, gerundOf, PERFECT_TENSES, SUBJUNCTIVE_TENSES,
} from './morphology.js';
import { sameLatin, sameLatinRequireFinalMacron, insertAtCursor } from './util.js';

const VOCAB = await loadChartVocab();

const MACRONS = ['ā', 'ē', 'ī', 'ō', 'ū'];
let lastFocusedInput = null;

const CASE_LABELS = { nom: 'Nominative', gen: 'Genitive', dat: 'Dative', acc: 'Accusative', abl: 'Ablative' };
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

let activeChart = CHARTS[0];
// Verb charts share one tense/voice/mood choice, kept while switching charts.
let verbTense = 'pres';
let verbVoice = 'act';
let verbMood = 'ind';
// Latin headword of the word last shown, so re-rendering keeps it selected.
let currentWord = null;

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

const VERB_LIKE = new Set(['verb', 'participle', 'gerund']);

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

function renderChart() {
  const words = wordsForChart(activeChart);
  if (words.length === 0) {
    chartArea.innerHTML = `<h2>${chartTitle(activeChart)}</h2>${tenseBarHTML(activeChart)}
      <div class="empty-state">No vocabulary words fit this chart yet.</div>`;
    wireTenseBar();
    return;
  }
  chartArea.innerHTML = `
    <h2>${chartTitle(activeChart)}</h2>
    ${tenseBarHTML(activeChart)}
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
    <div class="legend">${legendText(activeChart)}</div>
  `;

  wireTenseBar();
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
  }

  select.onchange = () => renderTableFor(words[select.value]);
  document.getElementById('randomBtn').onclick = () => {
    const idx = Math.floor(Math.random() * words.length);
    select.value = idx;
    renderTableFor(words[idx]);
  };

  const start = Math.max(0, words.findIndex(w => w.latin === currentWord));
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
    default: return verbTableHTML();
  }
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

function adj12TableHTML() {
  let rows = CASES.map(c => `
    <tr>
      <td class="case-label">${CASE_LABELS[c]}</td>
      <td><input data-case="${c}" data-gender="M" data-num="sg"></td>
      <td><input data-case="${c}" data-gender="F" data-num="sg"></td>
      <td><input data-case="${c}" data-gender="N" data-num="sg"></td>
      <td><input data-case="${c}" data-gender="M" data-num="pl"></td>
      <td><input data-case="${c}" data-gender="F" data-num="pl"></td>
      <td><input data-case="${c}" data-gender="N" data-num="pl"></td>
    </tr>`).join('');
  return `<table class="chart"><tr><th></th><th>M (sg)</th><th>F (sg)</th><th>N (sg)</th><th>M (pl)</th><th>F (pl)</th><th>N (pl)</th></tr>${rows}</table>`;
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
    default: {
      const forms = conjugateVerb(entry, verbTense, activeVoice(), activeMood());
      inputs.forEach(inp => {
        const p = inp.dataset.person, n = inp.dataset.num;
        markCell(inp, forms[n === 'sg' ? 'sg' + p : 'pl' + p]);
      });
    }
  }
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
