# Latin Practice — LFNM Level 1

A free, static practice site for *Latin for the New Millennium*, Level 1 (Chapters 1–10): vocabulary flashcards, grammar charts, and sentence analysis. No backend, no build step, no dependencies — just HTML/CSS/JS, so it runs directly on GitHub Pages.

## Sections

- **Vocabulary** (`flashcards.html`) — Quizlet-style flashcards (Latin front, English + gender on the back) and a multiple-choice Learning Mode. Wrong answers are re-queued until every word in the chosen chapters has been answered correctly once.
- **Grammar Charts** (`grammar.html`) — Fill-in-the-blank declension and conjugation charts (1st/2nd/3rd declension nouns including i-stems, 1st/2nd and 3rd declension adjectives, and present-tense verb conjugations for all five conjugation types). Pick any word from the vocabulary list, fill in the chart, and check your work — incorrect cells are flagged but never filled in for you. Forms are generated on the fly by `js/morphology.js` from each word's headword/genitive/principal parts, not hand-typed, so every word in the list is chartable.
- **Translation & Analysis** (`translate.html`) — 80 practice sentences (30 short textbook-quoted examples, attributed to their exact chapter/exercise, plus 50 original sentences built from the same vocabulary). For each sentence: case/number/gender above nouns and pronouns, person/number above verbs, and a usage/role tag below each — with a separate "which noun does this agree with" dropdown under adjectives.

## Data sources

- `data/vocabulary.js` — 190 words, Chapters 1–10, cross-checked against the textbook's own "Vocabulary to Learn" lists.
- `data/sentences.js` — 80 sentences with full word-by-word grammatical analysis (case, number, gender, person, syntactic role, adjective agreement) used to grade the Translation section. Textbook-quoted sentences are kept short and individually attributed, in line with fair-use practice for a classroom tool.

## Running locally

Just open `index.html` in a browser — everything is plain HTML/CSS/JS with no build step. If your browser blocks `fetch`/module loading from `file://`, serve the folder instead:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (as the repo root, or under `/docs`).
2. In the repo's **Settings → Pages**, set the source to the branch/folder you used.
3. The site will be live at `https://<username>.github.io/<repo-name>/` within a few minutes.

## Extending it

- Add more vocabulary: append rows to `data/vocabulary.js` (same shape as existing entries — `chapter`, `pos`, `latin`, `genitive`, `principal_parts`, `gender`, `declension`, `conjugation`, `english`).
- Add more sentences: append entries to `data/sentences.js`. Each sentence is tokenized word-by-word; see existing entries for the schema (`p` = part of speech: `n`/`pn`/`adj`/`v`/`vinf`/`prep`/`conj`/`adv`/`punct`).
- Grammar chart word-pickers and the flashcard deck both read directly from `data/vocabulary.js`, so new words show up automatically as long as `declension`/`conjugation`/`gender` are filled in correctly.
