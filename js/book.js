// Which textbook the activities are based on: LFNM Level 1 or Level 2.
// Chosen with the switch in the page header and remembered in this browser;
// a ?book=2 link opens straight into Level 2 (handy for sharing with a class).
const BOOKS = {
  1: { id: 1, name: 'Level 1', dir: '../data/' },
  2: { id: 2, name: 'Level 2', dir: '../data/level2/' },
};
const STORAGE_KEY = 'latin-practice-book';

function readBookId() {
  const fromUrl = new URLSearchParams(location.search).get('book');
  if (fromUrl === '1' || fromUrl === '2') {
    try { localStorage.setItem(STORAGE_KEY, fromUrl); } catch (e) {}
    return Number(fromUrl);
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1' || stored === '2') return Number(stored);
  } catch (e) {}
  return 1;
}

export const BOOK = BOOKS[readBookId()];
export const LEVEL_1 = BOOKS[1];

export async function loadVocab(book = BOOK) {
  return (await import(`${book.dir}vocabulary.js`)).VOCAB;
}

export async function loadEmoji(book = BOOK) {
  return (await import(`${book.dir}emoji.js`)).EMOJI;
}

export async function loadSentences(book = BOOK) {
  return (await import(`${book.dir}sentences.js`)).SENTENCES;
}

// Level 2 students know every Level 1 word too, so the grammar charts draw on
// both books (Level 2 words first).
export async function loadChartVocab() {
  if (BOOK.id === 1) return loadVocab(LEVEL_1);
  const [level2, level1] = await Promise.all([loadVocab(BOOK), loadVocab(LEVEL_1)]);
  return [...level2, ...level1];
}

function switchTo(id) {
  try { localStorage.setItem(STORAGE_KEY, String(id)); } catch (e) {}
  const url = new URL(location.href);
  url.searchParams.set('book', id);
  location.href = url.href;
}

function wireHeader() {
  document.querySelectorAll('.book-switch button[data-book]').forEach(btn => {
    const id = Number(btn.dataset.book);
    btn.setAttribute('aria-pressed', String(id === BOOK.id));
    btn.onclick = () => { if (id !== BOOK.id) switchTo(id); };
  });
  // Carry the choice in links too, so it survives even where storage is blocked.
  document.querySelectorAll('.site-header a[href], a.section-tile[href]').forEach(a => {
    const url = new URL(a.getAttribute('href'), location.href);
    url.searchParams.set('book', BOOK.id);
    a.href = url.href;
  });
  document.documentElement.dataset.book = BOOK.id;
}

wireHeader();
