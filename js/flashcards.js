import { VOCAB } from '../data/vocabulary.js';
import { EMOJI } from '../data/emoji.js';
import { shuffle } from './util.js';

const CHAPTERS = [...new Set(VOCAB.map(v => v.chapter))].sort((a, b) => a - b);

const state = {
  chapters: new Set(CHAPTERS), // all selected by default
  mode: 'flashcards', // 'flashcards' | 'learn' | 'test'
};

const chapterPicker = document.getElementById('chapterPicker');
const studyArea = document.getElementById('studyArea');
const modeFlashcardsBtn = document.getElementById('modeFlashcards');
const modeLearnBtn = document.getElementById('modeLearn');
const modeTestBtn = document.getElementById('modeTest');

function renderChapterPicker() {
  chapterPicker.innerHTML = '';
  const allChip = document.createElement('div');
  allChip.className = 'chapter-chip' + (state.chapters.size === CHAPTERS.length ? ' selected' : '');
  allChip.textContent = 'All';
  allChip.onclick = () => {
    if (state.chapters.size === CHAPTERS.length) state.chapters = new Set();
    else state.chapters = new Set(CHAPTERS);
    renderChapterPicker();
    restart();
  };
  chapterPicker.appendChild(allChip);

  CHAPTERS.forEach(ch => {
    const chip = document.createElement('div');
    chip.className = 'chapter-chip' + (state.chapters.has(ch) ? ' selected' : '');
    chip.textContent = 'Ch. ' + ch;
    chip.onclick = () => {
      if (state.chapters.has(ch)) state.chapters.delete(ch);
      else state.chapters.add(ch);
      renderChapterPicker();
      restart();
    };
    chapterPicker.appendChild(chip);
  });
}

function currentWords() {
  return VOCAB.filter(v => state.chapters.has(v.chapter));
}

// ---------------- Flashcards mode ----------------
const fcState = { deck: [], index: 0, flipped: false };

function startFlashcards() {
  fcState.deck = shuffle(currentWords());
  fcState.index = 0;
  fcState.flipped = false;
  renderFlashcards();
}

function renderFlashcards() {
  if (fcState.deck.length === 0) {
    studyArea.innerHTML = '<div class="empty-state">Select at least one chapter to begin.</div>';
    return;
  }
  const entry = fcState.deck[fcState.index];
  const genderPill = entry.gender ? `<span class="pill">${entry.gender}</span>` : '';
  const isNounWithGenitive = entry.pos === 'Noun' && entry.genitive;
  // Principal parts aren't introduced as a concept until Chapter 2 (Ch. 1
  // verbs are taught via their bare inflected form), so only show them from
  // Ch. 2 on -- matching the textbook's own sequencing.
  const isVerbWithParts = entry.pos === 'Verb' && entry.chapter >= 2 && entry.principal_parts;
  const frontText = isNounWithGenitive
    ? `${entry.latin}, ${entry.genitive}`
    : isVerbWithParts
    ? `${entry.latin}, ${entry.principal_parts}`
    : entry.latin;
  let frontClass = '';
  if (isNounWithGenitive) frontClass = ' compact';
  else if (isVerbWithParts) frontClass = frontText.length > 40 ? ' compact-sm' : ' compact';
  const emoji = EMOJI[entry.id];
  const emojiHTML = emoji ? `<div class="card-emoji">${emoji}</div>` : '';
  studyArea.innerHTML = `
    <div class="flashcard-stage">
      <div class="progress-text">Card ${fcState.index + 1} of ${fcState.deck.length} &middot; Chapter ${entry.chapter}</div>
      <div class="flashcard ${fcState.flipped ? 'flipped' : ''}" id="fcCard">
        <div class="flashcard-inner">
          <div class="flashcard-face front">
            <div class="word latin${frontClass}">${frontText}</div>
            <div class="sub">${entry.pos}</div>
            <div class="hint">Click card to flip</div>
          </div>
          <div class="flashcard-face back">
            ${emojiHTML}
            <div class="word">${entry.english}</div>
            <div class="sub">${genderPill}</div>
            <div class="hint">Click card to flip</div>
          </div>
        </div>
      </div>
      <div class="flashcard-controls">
        <button class="secondary" id="fcPrev">&larr; Prev</button>
        <button id="fcShuffle">Shuffle</button>
        <button class="secondary" id="fcNext">Next &rarr;</button>
      </div>
    </div>
  `;
  document.getElementById('fcCard').onclick = () => {
    fcState.flipped = !fcState.flipped;
    renderFlashcards();
  };
  document.getElementById('fcPrev').onclick = () => {
    fcState.index = (fcState.index - 1 + fcState.deck.length) % fcState.deck.length;
    fcState.flipped = false;
    renderFlashcards();
  };
  document.getElementById('fcNext').onclick = () => {
    fcState.index = (fcState.index + 1) % fcState.deck.length;
    fcState.flipped = false;
    renderFlashcards();
  };
  document.getElementById('fcShuffle').onclick = () => {
    fcState.deck = shuffle(fcState.deck);
    fcState.index = 0;
    fcState.flipped = false;
    renderFlashcards();
  };
}

// ---------------- Learning mode ----------------
const lmState = { queue: [], total: 0, mastered: new Set(), current: null, direction: null, options: [], answered: false };

function startLearn() {
  const words = currentWords();
  lmState.queue = shuffle(words);
  lmState.total = words.length;
  lmState.mastered = new Set();
  nextQuestion();
}

function nextQuestion() {
  lmState.answered = false;
  if (lmState.queue.length === 0) {
    renderLearnComplete();
    return;
  }
  const entry = lmState.queue[0];
  const direction = Math.random() < 0.5 ? 'l2e' : 'e2l'; // latin-to-english or english-to-latin
  const pool = currentWords().filter(w => w.id !== entry.id);
  const distractors = shuffle(pool).slice(0, 3);
  const options = shuffle([entry, ...distractors]);
  lmState.current = entry;
  lmState.direction = direction;
  lmState.options = options;
  renderLearn();
}

function displayFront(entry, direction) {
  return direction === 'l2e' ? entry.latin : entry.english;
}
function displayOption(entry, direction) {
  if (direction === 'l2e') {
    return entry.english + (entry.gender ? ` (${entry.gender})` : '');
  }
  return entry.latin;
}

function renderLearn() {
  if (lmState.total === 0) {
    studyArea.innerHTML = '<div class="empty-state">Select at least one chapter to begin.</div>';
    return;
  }
  const { current, direction, options } = lmState;
  const masteredCount = lmState.mastered.size;
  const promptLabel = direction === 'l2e' ? 'What does this word mean?' : 'Which Latin word matches?';
  studyArea.innerHTML = `
    <div class="stat-row">
      <div class="stat"><div class="num">${masteredCount}/${lmState.total}</div><div class="label">Mastered</div></div>
      <div class="stat"><div class="num">${lmState.queue.length}</div><div class="label">Remaining in queue</div></div>
    </div>
    <div class="mc-sub">${promptLabel}</div>
    <div class="mc-prompt latin">${displayFront(current, direction)}</div>
    <div class="mc-options" id="mcOptions"></div>
  `;
  const optionsDiv = document.getElementById('mcOptions');
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'mc-option latin';
    btn.textContent = displayOption(opt, direction);
    btn.onclick = () => handleAnswer(opt, btn, optionsDiv);
    optionsDiv.appendChild(btn);
  });
}

function handleAnswer(selected, btnEl, optionsDiv) {
  if (lmState.answered) return;
  lmState.answered = true;
  const correct = selected.id === lmState.current.id;
  const buttons = [...optionsDiv.children];
  buttons.forEach(b => (b.disabled = true));
  if (correct) {
    btnEl.classList.add('correct');
  } else {
    btnEl.classList.add('incorrect');
    const correctBtn = buttons.find(b => b.textContent === displayOption(lmState.current, lmState.direction));
    if (correctBtn) correctBtn.classList.add('correct');
  }

  const finishedWord = lmState.queue.shift();
  if (correct) {
    lmState.mastered.add(finishedWord.id);
  } else {
    lmState.queue.push(finishedWord);
  }

  setTimeout(nextQuestion, 900);
}

function renderLearnComplete() {
  studyArea.innerHTML = `
    <div class="empty-state">
      <div style="font-size:2.4rem;">🎉</div>
      <h2 style="color:var(--maroon-dark);">Activity complete!</h2>
      <p>You answered all ${lmState.total} words correctly.</p>
      <button id="lmRestart">Study again</button>
    </div>
  `;
  document.getElementById('lmRestart').onclick = startLearn;
}

// ---------------- Mode switching ----------------
// ---------------- Test mode (fixed 10 questions, no requeue) ----------------
const testState = { questions: [], index: 0, correct: 0, current: null, direction: null, options: [], answered: false };

function startTest() {
  const words = currentWords();
  testState.questions = shuffle(words).slice(0, Math.min(10, words.length));
  testState.index = 0;
  testState.correct = 0;
  nextTestQuestion();
}

function nextTestQuestion() {
  testState.answered = false;
  if (testState.index >= testState.questions.length) {
    renderTestComplete();
    return;
  }
  const entry = testState.questions[testState.index];
  const direction = Math.random() < 0.5 ? 'l2e' : 'e2l';
  const pool = currentWords().filter(w => w.id !== entry.id);
  const distractors = shuffle(pool).slice(0, 3);
  const options = shuffle([entry, ...distractors]);
  testState.current = entry;
  testState.direction = direction;
  testState.options = options;
  renderTest();
}

function renderTest() {
  if (testState.questions.length === 0) {
    studyArea.innerHTML = '<div class="empty-state">Select at least one chapter to begin.</div>';
    return;
  }
  const { current, direction, options, index, questions, correct } = testState;
  const promptLabel = direction === 'l2e' ? 'What does this word mean?' : 'Which Latin word matches?';
  studyArea.innerHTML = `
    <div class="stat-row">
      <div class="stat"><div class="num">${index + 1}/${questions.length}</div><div class="label">Question</div></div>
      <div class="stat"><div class="num">${correct}</div><div class="label">Correct so far</div></div>
    </div>
    <div class="mc-sub">${promptLabel}</div>
    <div class="mc-prompt latin">${displayFront(current, direction)}</div>
    <div class="mc-options" id="mcOptions"></div>
  `;
  const optionsDiv = document.getElementById('mcOptions');
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'mc-option latin';
    btn.textContent = displayOption(opt, direction);
    btn.onclick = () => handleTestAnswer(opt, btn, optionsDiv);
    optionsDiv.appendChild(btn);
  });
}

function handleTestAnswer(selected, btnEl, optionsDiv) {
  if (testState.answered) return;
  testState.answered = true;
  const correct = selected.id === testState.current.id;
  const buttons = [...optionsDiv.children];
  buttons.forEach(b => (b.disabled = true));
  if (correct) {
    btnEl.classList.add('correct');
    testState.correct++;
  } else {
    btnEl.classList.add('incorrect');
    const correctBtn = buttons.find(b => b.textContent === displayOption(testState.current, testState.direction));
    if (correctBtn) correctBtn.classList.add('correct');
  }
  testState.index++;
  setTimeout(nextTestQuestion, 900);
}

function renderTestComplete() {
  const total = testState.questions.length;
  const score = `${testState.correct}/${total}`;
  studyArea.innerHTML = `
    <div class="empty-state">
      <div style="font-size:2.4rem;">📝</div>
      <h2 style="color:var(--maroon-dark);">Test complete!</h2>
      <p>You got <strong>${score}</strong> correct.</p>
      <button id="testRestart">Try again</button>
    </div>
  `;
  document.getElementById('testRestart').onclick = startTest;
}

function restart() {
  if (state.mode === 'flashcards') startFlashcards();
  else if (state.mode === 'learn') startLearn();
  else startTest();
}

const modeButtons = [
  [modeFlashcardsBtn, 'flashcards', startFlashcards],
  [modeLearnBtn, 'learn', startLearn],
  [modeTestBtn, 'test', startTest],
];
modeButtons.forEach(([btn, mode, start]) => {
  btn.onclick = () => {
    state.mode = mode;
    modeButtons.forEach(([b]) => b.classList.toggle('active', b === btn));
    start();
  };
});

renderChapterPicker();
startFlashcards();
