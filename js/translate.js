import { SENTENCES } from '../data/sentences.js';

const CASE_OPTIONS = [
  ['nom', 'Nominative'], ['gen', 'Genitive'], ['dat', 'Dative'],
  ['acc', 'Accusative'], ['abl', 'Ablative'], ['voc', 'Vocative'],
];
const NUM_OPTIONS = [['sg', 'Singular'], ['pl', 'Plural']];
const GENDER_OPTIONS = [['m', 'Masc.'], ['f', 'Fem.'], ['n', 'Neut.']];
const PERSON_OPTIONS = [['1', '1st'], ['2', '2nd'], ['3', '3rd']];

const NOUN_ROLE_OPTIONS = [
  ['subject', 'subject'],
  ['direct-object', 'direct object'],
  ['subject-complement', 'subject complement'],
  ['possessive', 'possessive'],
  ['indirect-object', 'indirect object'],
  ['object-of-prep', 'object of a preposition'],
  ['abl-instrument', 'ablative of instrument'],
  ['abl-manner', 'ablative of manner'],
  ['abl-agent', 'ablative of agent'],
  ['abl-place-from-which', 'ablative of place from which'],
  ['abl-separation', 'ablative of separation'],
  ['abl-time', 'ablative of time'],
  ['vocative', 'vocative (direct address)'],
];

const VERB_ROLE_OPTIONS = [
  ['transitive-verb', 'transitive verb'],
  ['intransitive-verb', 'intransitive verb'],
  ['linking-verb', 'linking verb'],
  ['main-verb-complementary-infinitive', 'main verb + complementary infinitive'],
  ['passive-verb', 'passive verb'],
  ['head-verb', 'head verb'],
];

const PROGRESS_KEY = 'latin-translate-progress-v1';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch (e) {}
}

const CHAPTERS = [...new Set(SENTENCES.map(s => s.chapter))].sort((a, b) => a - b);
const state = { chapters: new Set(CHAPTERS), activeSentence: null };

const chapterPicker = document.getElementById('chapterPicker');
const sentenceListEl = document.getElementById('sentenceList');
const listCard = document.getElementById('listCard');
const analysisCard = document.getElementById('analysisCard');
const analysisArea = document.getElementById('analysisArea');
const backBtn = document.getElementById('backBtn');

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderChapterPicker() {
  chapterPicker.innerHTML = '';
  const allChip = document.createElement('div');
  allChip.className = 'chapter-chip' + (state.chapters.size === CHAPTERS.length ? ' selected' : '');
  allChip.textContent = 'All';
  allChip.onclick = () => {
    state.chapters = state.chapters.size === CHAPTERS.length ? new Set() : new Set(CHAPTERS);
    renderChapterPicker();
    renderSentenceList();
  };
  chapterPicker.appendChild(allChip);
  CHAPTERS.forEach(ch => {
    const chip = document.createElement('div');
    chip.className = 'chapter-chip' + (state.chapters.has(ch) ? ' selected' : '');
    chip.textContent = 'Ch. ' + ch;
    chip.onclick = () => {
      if (state.chapters.has(ch)) state.chapters.delete(ch); else state.chapters.add(ch);
      renderChapterPicker();
      renderSentenceList();
    };
    chapterPicker.appendChild(chip);
  });
}

function renderSentenceList() {
  const progress = loadProgress();
  const filtered = SENTENCES.filter(s => state.chapters.has(s.chapter));
  sentenceListEl.innerHTML = '';
  if (filtered.length === 0) {
    sentenceListEl.innerHTML = '<div class="empty-state">Select at least one chapter.</div>';
    return;
  }
  filtered.forEach(s => {
    const item = document.createElement('div');
    item.className = 'sentence-item';
    const done = progress[s.id];
    item.innerHTML = `
      <div>
        <span class="pill">Ch. ${s.chapter}</span>
        <span class="latin">&nbsp;${escapeHtml(s.latin)}</span>
      </div>
      <div class="status ${done ? 'done' : ''}">${done ? '✓ Done' : ''}</div>
    `;
    item.onclick = () => openSentence(s.id);
    sentenceListEl.appendChild(item);
  });
}

function selectHTML(cls, options, placeholder) {
  const opts = options.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  return `<select class="${cls}"><option value="">${placeholder}</option>${opts}</select>`;
}

function renderWordHTML(token, idx, tokens) {
  if (token.p === 'punct') return `<span class="punct-inline">${escapeHtml(token.t)}</span>`;
  if (token.p === 'prep' || token.p === 'conj' || token.p === 'adv' || token.p === 'vinf') {
    return `<span class="plain-word latin">${escapeHtml(token.t)}</span>`;
  }
  if (token.p === 'adj') {
    const nounOpts = tokens
      .map((t, i) => ({ t, i }))
      .filter(x => x.t.p === 'n')
      .map(x => `<option value="${x.i}">${escapeHtml(x.t.t)}</option>`).join('');
    return `
      <span class="analysis-word" data-idx="${idx}" data-type="adj">
        <span class="word-text latin">${escapeHtml(token.t)}</span>
        <select class="f-agree">
          <option value="">agrees with…</option>
          <option value="none">(none — used alone)</option>
          ${nounOpts}
        </select>
      </span>`;
  }
  if (token.p === 'n' || token.p === 'pn') {
    const caseSel = selectHTML('f-case', CASE_OPTIONS, 'case');
    const numSel = selectHTML('f-num', NUM_OPTIONS, 'num.');
    const genderSel = token.p === 'n' ? selectHTML('f-gender', GENDER_OPTIONS, 'gender') : '';
    const roleSel = selectHTML('f-role', NOUN_ROLE_OPTIONS, 'usage…');
    return `
      <span class="analysis-word" data-idx="${idx}" data-type="${token.p}">
        <span class="field-row">${caseSel}${numSel}${genderSel}</span>
        <span class="word-text latin">${escapeHtml(token.t)}</span>
        ${roleSel}
      </span>`;
  }
  if (token.p === 'v') {
    const personSel = selectHTML('f-person', PERSON_OPTIONS, 'person');
    const numSel = selectHTML('f-num', NUM_OPTIONS, 'num.');
    const roleSel = selectHTML('f-role', VERB_ROLE_OPTIONS, 'usage…');
    return `
      <span class="analysis-word" data-idx="${idx}" data-type="v">
        <span class="field-row">${personSel}${numSel}</span>
        <span class="word-text latin">${escapeHtml(token.t)}</span>
        ${roleSel}
      </span>`;
  }
  return `<span class="plain-word latin">${escapeHtml(token.t)}</span>`;
}

function openSentence(id) {
  const sentence = SENTENCES.find(s => s.id === id);
  state.activeSentence = sentence;
  listCard.style.display = 'none';
  analysisCard.style.display = 'block';

  const wordsHTML = sentence.tokens.map((t, i) => renderWordHTML(t, i, sentence.tokens)).join('');
  const sourceLine = sentence.type === 'Textbook Quote'
    ? `<div class="legend">Textbook quote — ${escapeHtml(sentence.source)}</div>`
    : '';

  analysisArea.innerHTML = `
    <p class="pill">Chapter ${sentence.chapter}</p>
    <div class="analysis-sentence">${wordsHTML}</div>
    <p><strong>English:</strong> ${escapeHtml(sentence.english)}</p>
    ${sourceLine}
    <div class="chart-toolbar">
      <button id="checkSentenceBtn">Check My Work</button>
      <button class="secondary" id="clearSentenceBtn">Clear</button>
    </div>
    <div id="scoreBanner"></div>
    <div class="legend">Adjectives only need the agreement dropdown. Everything else (prepositions, conjunctions, adverbs, infinitives) is shown for context and doesn't need to be tagged.</div>
  `;

  document.getElementById('checkSentenceBtn').onclick = () => checkSentence(sentence);
  document.getElementById('clearSentenceBtn').onclick = () => {
    analysisArea.querySelectorAll('select').forEach(sel => {
      sel.value = '';
      sel.classList.remove('field-good', 'field-bad');
    });
    document.getElementById('scoreBanner').innerHTML = '';
  };
}

function checkSentence(sentence) {
  let total = 0, correct = 0, filled = 0;
  const words = analysisArea.querySelectorAll('.analysis-word');
  words.forEach(wordEl => {
    const idx = Number(wordEl.dataset.idx);
    const type = wordEl.dataset.type;
    const token = sentence.tokens[idx];

    const checkField = (selector, expected) => {
      const sel = wordEl.querySelector(selector);
      if (!sel) return;
      total++;
      sel.classList.remove('field-good', 'field-bad');
      if (!sel.value) return;
      filled++;
      if (sel.value === String(expected)) {
        sel.classList.add('field-good');
        correct++;
      } else {
        sel.classList.add('field-bad');
      }
    };

    if (type === 'n' || type === 'pn') {
      checkField('.f-case', token.case);
      checkField('.f-num', token.num);
      if (type === 'n') checkField('.f-gender', token.gender);
      checkField('.f-role', token.role);
    } else if (type === 'v') {
      checkField('.f-person', token.person);
      checkField('.f-num', token.num);
      checkField('.f-role', token.role);
    } else if (type === 'adj') {
      const expected = (token.agrees === null || token.agrees === undefined) ? 'none' : token.agrees;
      checkField('.f-agree', expected);
    }
  });

  const banner = document.getElementById('scoreBanner');
  const allCorrect = total > 0 && correct === total && filled === total;
  banner.innerHTML = `<div class="score-banner ${allCorrect ? 'all-correct' : ''}">
    <span>${correct} of ${total} fields correct${filled < total ? ` (${total - filled} left blank)` : ''}</span>
    <span>${allCorrect ? '✓ All correct!' : ''}</span>
  </div>`;

  const progress = loadProgress();
  progress[sentence.id] = allCorrect;
  saveProgress(progress);
}

backBtn.onclick = () => {
  listCard.style.display = 'block';
  analysisCard.style.display = 'none';
  renderSentenceList();
};

renderChapterPicker();
renderSentenceList();
