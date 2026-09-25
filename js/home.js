import { BOOK, loadVocab, loadSentences } from './book.js';

const [vocab, sentences] = await Promise.all([loadVocab(), loadSentences()]);
const lastChapter = Math.max(...vocab.map(v => v.chapter));
const chapters = `Chapters 1–${lastChapter}`;
const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

document.title = `Latin Practice — LFNM ${BOOK.name}`;
set('bookTitle', `Latin for the New Millennium — ${BOOK.name}`);
set('bookIntro', `Practice vocabulary, grammar forms, and sentence analysis for ${chapters}. Pick a section below to get started.`);
set('vocabTileText', `Flashcards, a multiple-choice learning mode, and a 10-question test, organized by chapter. ${vocab.length} words across ${chapters}.`);
set('translateTileText', `Tag case, number, gender, person, tense, agreement, and syntactic role for ${sentences.length} practice sentences.`);
const sourceNote = BOOK.id === 1
  ? 'Textbook sentences quoted briefly and attributed; all other content is original practice material.'
  : 'All practice sentences are original compositions.';
set('footerText', `Built for Latin for the New Millennium, ${BOOK.name} (${chapters}). ${sourceNote}`);
