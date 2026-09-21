import { VOCAB } from '../data/vocabulary.js';
import { declineNoun, nounCategory, declineAdjective, adjectiveCategory, conjugateVerb, verbCategory } from './morphology.js';
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
];

const ADJ_CHARTS = [
  { id: 'a-12', label: '1st/2nd Declension Adjectives', cat: '12decl' },
  { id: 'a-3', label: '3rd Declension Adjectives', cat: '3decl' },
];

const VERB_CHARTS = [
  { id: 'v-1st', label: '1st Conjugation Verbs (Present)', cat: '1st' },
  { id: 'v-2nd', label: '2nd Conjugation Verbs (Present)', cat: '2nd' },
  { id: 'v-3rd', label: '3rd Conjugation Verbs (Present)', cat: '3rd' },
  { id: 'v-3rdio', label: '3rd Conjugation -iō Verbs (Present)', cat: '3rd (-iō)' },
  { id: 'v-4th', label: '4th Conjugation Verbs (Present)', cat: '4th' },
];

const ALL_CHARTS = [
  ...NOUN_CHARTS.map(c => ({ ...c, kind: 'noun' })),
  ...ADJ_CHARTS.map(c => ({ ...c, kind: 'adjective' })),
  ...VERB_CHARTS.map(c => ({ ...c, kind: 'verb' })),
];

const chartPicker = document.getElementById('chartPicker');
const chartArea = document.getElementById('chartArea');

let activeChart = ALL_CHARTS[0];

function wordsForChart(chart) {
  if (chart.kind === 'noun') return VOCAB.filter(v => nounCategory(v) === chart.cat);
  if (chart.kind === 'adjective') return VOCAB.filter(v => adjectiveCategory(v) === chart.cat);
  return VOCAB.filter(v => verbCategory(v) === chart.cat);
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

function wordLabel(entry) {
  if (activeChart.kind === 'noun' && entry.genitive) {
    return `${entry.latin}, ${entry.genitive} — ${entry.english}`;
  }
  return `${entry.latin} — ${entry.english}`;
}

function renderChart() {
  const words = wordsForChart(activeChart);
  if (words.length === 0) {
    chartArea.innerHTML = '<div class="empty-state">No vocabulary words fit this chart yet.</div>';
    return;
  }
  chartArea.innerHTML = `
    <h2>${activeChart.label}</h2>
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
    <div class="legend">Green = correct, red = incorrect. Macrons (long marks) are optional almost everywhere — except the 1st declension ablative singular, which needs the macron on the final letter to tell it apart from the nominative singular.</div>
  `;

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
    const prompt = document.getElementById('wordPrompt');
    if (activeChart.kind === 'noun' && entry.genitive) {
      prompt.innerHTML = `<p><strong>${entry.latin}, ${entry.genitive}</strong> <span style="color:var(--ink-soft);">— ${entry.english}</span> (genitive singular shown so you can find the stem)</p>`;
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

  renderTableFor(words[0]);
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
      // 1st decl. abl. sg. ("agricolā") is spelled identically to nom. sg.
      // ("agricola") without the macron, so the macron must be typed there.
      const strict = activeChart.cat === '1st' && c === 'abl' && n === 'sg';
      markCell(inp, expected, strict);
    });
  } else if (activeChart.kind === 'adjective') {
    const result = declineAdjective(entry);
    wrap.querySelectorAll('input').forEach(inp => {
      const c = inp.dataset.case, n = inp.dataset.num, g = inp.dataset.gender;
      const expected = result.forms[g][n][c];
      // Same 1st-declension ambiguity, but only the feminine column uses the
      // "-a"/"-ā" pattern (masc./neut. abl. sg. is "-ō", never ambiguous).
      const strict = activeChart.cat === '12decl' && g === 'F' && c === 'abl' && n === 'sg';
      markCell(inp, expected, strict);
    });
  } else {
    const forms = conjugateVerb(entry);
    wrap.querySelectorAll('input').forEach(inp => {
      const p = inp.dataset.person, n = inp.dataset.num;
      const expected = forms[n === 'sg' ? 'sg' + p : 'pl' + p];
      markCell(inp, expected);
    });
  }
}

function markCell(inp, expected, requireFinalMacron) {
  const td = inp.parentElement;
  td.classList.remove('correct', 'incorrect');
  if (!inp.value.trim()) {
    return; // leave blank cells unmarked
  }
  const ok = requireFinalMacron
    ? sameLatinRequireFinalMacron(inp.value, expected)
    : sameLatin(inp.value, expected);
  if (ok) td.classList.add('correct');
  else td.classList.add('incorrect');
}

renderChartPicker();
renderChart();
