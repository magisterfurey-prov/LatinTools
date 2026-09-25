import { VOCAB } from '../data/vocabulary.js';
import {
  declineNoun, nounCategory, declineAdjective, adjectiveCategory, conjugateVerb, verbCategory, verbHasForms, PERFECT_TENSES,
} from './morphology.js';
import { sameLatin, sameLatinRequireFinalMacron, insertAtCursor } from './util.js';

const MACRONS = ['ā', 'ē', 'ī', 'ō', 'ū'];
let lastFocusedInput = null;

const CASE_LABELS = { nom: 'Nominative', gen: 'Genitive', dat: 'Dative', acc: 'Accusative', abl: 'Ablative' };
const CASES = ['nom', 'gen', 'dat', 'acc', 'abl'];

const NOUN_CHARTS = [
  { id: 'n-1st', label: '1st Declension Nouns', cat: '1st' },
  { id: 'n-2nd-masc', label: '2nd Declension Nouns (Masc., -us)', cat: '2nd-masc' },
  { id: 'n-2nd-neuter', label: '2nd Declension Nouns (Neuter)', cat: '2nd-neuter' },
  { id: 'n-2nd-er', label: '2nd Declension Nouns (-er)', cat: '2nd-er' },
  { id: 'n-3rd-masc', label: '3rd Declension Nouns (Masc.)', cat: '3rd-masc' },
  { id: 'n-3rd-fem', label: '3rd Declension Nouns (Fem.)', cat: '3rd-fem' },
  { id: 'n-3rd-neuter', label: '3rd Declension Nouns (Neuter)', cat: '3rd-neuter' },
  { id: 'n-3rd-istem', label: '3rd Declension Nouns (i-stem)', cat: '3rd-istem' },
  { id: 'n-4th', label: '4th Declension Nouns (Masc./Fem.)', cat: '4th' },
  { id: 'n-4th-neuter', label: '4th Declension Nouns (Neuter)', cat: '4th-neuter' },
  { id: 'n-5th', label: '5th Declension Nouns', cat: '5th' },
];

const ADJ_CHARTS = [
  { id: 'a-12', label: '1st/2nd Declension Adjectives', cat: '12decl' },
  { id: 'a-3', label: '3rd Declension Adjectives', cat: '3decl' },
];

const VERB_CHARTS = [
  { id: 'v-1st', label: '1st Conjugation Verbs', cat: '1st' },
  { id: 'v-2nd', label: '2nd Conjugation Verbs', cat: '2nd' },
  { id: 'v-3rd', label: '3rd Conjugation Verbs', cat: '3rd' },
  { id: 'v-3rdio', label: '3rd Conjugation -iō Verbs', cat: '3rd (-iō)' },
  { id: 'v-4th', label: '4th Conjugation Verbs', cat: '4th' },
  { id: 'v-irr', label: 'sum and possum (Irregular)', cat: 'irregular' },
];

const TENSES = [
  ['pres', 'Present'], ['impf', 'Imperfect'], ['fut', 'Future'],
  ['perf', 'Perfect'], ['plup', 'Pluperfect'], ['futperf', 'Future Perfect'],
];
const VOICES = [['act', 'Active'], ['pass', 'Passive']];

const ALL_CHARTS = [
  ...NOUN_CHARTS.map(c => ({ ...c, kind: 'noun' })),
  ...ADJ_CHARTS.map(c => ({ ...c, kind: 'adjective' })),
  ...VERB_CHARTS.map(c => ({ ...c, kind: 'verb' })),
];

const chartPicker = document.getElementById('chartPicker');
const chartArea = document.getElementById('chartArea');

let activeChart = ALL_CHARTS[0];
// Verb charts share one tense/voice choice, kept while switching charts.
let verbTense = 'pres';
let verbVoice = 'act';
// Latin headword of the word last shown, so re-rendering keeps it selected.
let currentWord = null;

// sum and possum have no passive.
function activeVoice() {
  return activeChart.cat === 'irregular' ? 'act' : verbVoice;
}

// Chapter of LFNM Level 1 that introduces each set of verb forms.
function textbookChapter(conj, tense, voice) {
  if (conj === 'irregular') return { pres: 6, impf: 11, fut: 14, perf: 16, plup: 17, futperf: 18 }[tense];
  if (tense === 'pres') {
    if (voice === 'pass' && (conj === '1st' || conj === '2nd')) return 5;
    return { '1st': 2, '2nd': 2, '3rd': 8, '4th': 9, '3rd (-iō)': 10 }[conj];
  }
  if (tense === 'impf') return 11;
  if (tense === 'fut') return conj === '1st' || conj === '2nd' ? 14 : 15;
  return (voice === 'act' ? { perf: 16, plup: 17, futperf: 18 } : { perf: 19, plup: 20, futperf: 21 })[tense];
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

function wordsForChart(chart) {
  let words;
  if (chart.kind === 'noun') words = VOCAB.filter(v => nounCategory(v) === chart.cat);
  else if (chart.kind === 'adjective') words = VOCAB.filter(v => adjectiveCategory(v) === chart.cat);
  else if (chart.cat === 'irregular') words = VOCAB.filter(v => v.pos === 'Verb' && (v.latin === 'sum' || v.latin === 'possum'));
  else {
    words = VOCAB.filter(v => verbCategory(v) === chart.cat && isVerbCitationForm(v)
      && verbHasForms(v, verbTense, verbVoice));
  }
  return uniqueByLatin(words);
}

function optionsHTML(options, selected) {
  return options.map(([v, l]) => `<option value="${v}"${v === selected ? ' selected' : ''}>${l}</option>`).join('');
}

function chartTitle(chart) {
  if (chart.kind !== 'verb') return chart.label;
  const tense = TENSES.find(([v]) => v === verbTense)[1];
  const voice = chart.cat === 'irregular' ? '' : ' ' + VOICES.find(([v]) => v === verbVoice)[1];
  return `${chart.label} — ${tense}${voice}`;
}

function tenseBarHTML(chart) {
  if (chart.kind !== 'verb') return '';
  const voiceDisabled = chart.cat === 'irregular' ? ' disabled title="sum and possum have no passive"' : '';
  return `
    <div class="chart-toolbar">
      <label for="tenseSelect">Tense:</label>
      <select id="tenseSelect">${optionsHTML(TENSES, verbTense)}</select>
      <label for="voiceSelect">Voice:</label>
      <select id="voiceSelect"${voiceDisabled}>${optionsHTML(VOICES, activeVoice())}</select>
      <span class="legend" style="margin:0;">Introduced in Chapter ${textbookChapter(chart.cat, verbTense, activeVoice())}</span>
    </div>`;
}

function wireTenseBar() {
  const tenseSelect = document.getElementById('tenseSelect');
  if (!tenseSelect) return;
  tenseSelect.onchange = () => { verbTense = tenseSelect.value; renderChart(); };
  document.getElementById('voiceSelect').onchange = e => { verbVoice = e.target.value; renderChart(); };
}

function renderChartPicker() {
  chartPicker.innerHTML = '';
  const groups = [
    { title: 'Nouns', items: NOUN_CHARTS.map(c => ({ ...c, kind: 'noun' })) },
    { title: 'Adjectives', items: ADJ_CHARTS.map(c => ({ ...c, kind: 'adjective' })) },
    { title: 'Verbs', items: VERB_CHARTS.map(c => ({ ...c, kind: 'verb' })) },
  ];
  groups.forEach(g => {
    const label = document.createElement('div');
    label.style.cssText = 'width:100%;font-weight:600;color:var(--maroon-dark);margin-top:6px;';
    label.textContent = g.title;
    chartPicker.appendChild(label);
    g.items.forEach(chart => {
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
  if (activeChart.kind === 'verb' && entry.principal_parts) return `${entry.latin}, ${entry.principal_parts}`;
  return entry.latin;
}

function wordLabel(entry) {
  return `${citationText(entry)} — ${entry.english}`;
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
    const prompt = document.getElementById('wordPrompt');
    if (activeChart.kind === 'noun' && entry.genitive) {
      prompt.innerHTML = `<p><strong>${entry.latin}, ${entry.genitive}</strong> <span style="color:var(--ink-soft);">— ${entry.english}</span> (genitive singular shown so you can find the stem)</p>`;
    } else if (activeChart.kind === 'verb' && entry.principal_parts) {
      prompt.innerHTML = `<p><strong>${entry.latin}, ${entry.principal_parts}</strong> <span style="color:var(--ink-soft);">— ${entry.english}</span> (all principal parts shown so you can find the correct stem)</p>`;
    } else {
      prompt.innerHTML = '';
    }
    const wrap = document.getElementById('tableWrap');
    if (activeChart.kind === 'noun') wrap.innerHTML = nounTableHTML();
    else if (activeChart.kind === 'adjective') wrap.innerHTML = adjTableHTML(activeChart.cat);
    else wrap.innerHTML = verbTableHTML();

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
  if (chart.kind === 'verb') {
    let text = 'Green = correct, red = incorrect. Macrons (long marks) are optional.';
    if (activeVoice() === 'pass' && PERFECT_TENSES.includes(verbTense)) {
      text += ' Type both words — the participle and the form of sum (e.g. parātus est); any gender of the participle is accepted.';
    }
    return text;
  }
  const base = 'Green = correct, red = incorrect. Macrons (long marks) are optional almost everywhere';
  if (chart.cat === '4th') {
    return `${base} — except the -ūs endings (genitive singular, nominative and accusative plural), which need the macron to tell them apart from the nominative singular -us.`;
  }
  return `${base} — except the 1st declension ablative singular, which needs the macron on the final letter to tell it apart from the nominative singular.`;
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

function nounTableHTML() {
  let rows = CASES.map(c => `
    <tr>
      <td class="case-label">${CASE_LABELS[c]}</td>
      <td><input data-case="${c}" data-num="sg" autocomplete="off" spellcheck="false"></td>
      <td><input data-case="${c}" data-num="pl" autocomplete="off" spellcheck="false"></td>
    </tr>`).join('');
  return `<table class="chart"><tr><th></th><th>Singular</th><th>Plural</th></tr>${rows}</table>`;
}

function adjTableHTML(cat) {
  if (cat === '12decl') {
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
  // 3rd declension: M/F identical, so combine
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

function checkChart(entry) {
  const wrap = document.getElementById('tableWrap');
  if (activeChart.kind === 'noun') {
    const forms = declineNoun(entry);
    wrap.querySelectorAll('input').forEach(inp => {
      const c = inp.dataset.case, n = inp.dataset.num;
      const expected = forms[n][c];
      markCell(inp, expected, strictEndingLength(activeChart.cat, c, n));
    });
  } else if (activeChart.kind === 'adjective') {
    const result = declineAdjective(entry);
    wrap.querySelectorAll('input').forEach(inp => {
      const c = inp.dataset.case, n = inp.dataset.num, g = inp.dataset.gender;
      const expected = result.forms[g][n][c];
      // Same 1st-declension ambiguity, but only the feminine column uses the
      // "-a"/"-ā" pattern (masc./neut. abl. sg. is "-ō", never ambiguous).
      const strict = activeChart.cat === '12decl' && g === 'F' && c === 'abl' && n === 'sg';
      markCell(inp, expected, strict ? 1 : 0);
    });
  } else {
    const forms = conjugateVerb(entry, verbTense, activeVoice());
    wrap.querySelectorAll('input').forEach(inp => {
      const p = inp.dataset.person, n = inp.dataset.num;
      const expected = forms[n === 'sg' ? 'sg' + p : 'pl' + p];
      markCell(inp, expected);
    });
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
