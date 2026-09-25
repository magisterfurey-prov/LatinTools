# Latin Practice — LFNM Level 1 (static edition)

> **This is the static, backend-free fork.** It runs entirely in the browser on GitHub Pages: no login, no class rosters, no server. Progress is saved only in each student's own browser (`localStorage`). The full version with Google sign-in and teacher dashboards lives in a separate project.

A free, static practice site for *Latin for the New Millennium*, Level 1 (Chapters 1–10): vocabulary flashcards, grammar charts, and sentence analysis. No backend, no build step, no dependencies — just HTML/CSS/JS, so it runs directly on GitHub Pages.

## Sections

- **Vocabulary** (`flashcards.html`) — Quizlet-style flashcards (Latin front, English + gender on the back, with a small emoji visual mnemonic) and a multiple-choice Learning Mode. Wrong answers are re-queued until every word in the chosen chapters has been answered correctly once. A **Test** mode gives a fixed 10-question multiple-choice quiz (no re-queuing, mixed Latin→English and English→Latin) and shows the score at the end. Noun fronts show the genitive singular; verb fronts (Ch. 2+) show all principal parts, matching standard dictionary citation form.
- **Grammar Charts** (`grammar.html`) — Fill-in-the-blank declension and conjugation charts (1st/2nd/3rd declension nouns including i-stems, 1st/2nd and 3rd declension adjectives, and present-tense verb conjugations for all five conjugation types). Pick any word from the vocabulary list, fill in the chart, and check your work — incorrect cells are flagged but never filled in for you. Forms are generated on the fly by `js/morphology.js` from each word's headword/genitive/principal parts, not hand-typed, so every word in the list is chartable. The genitive singular (nouns) or full principal parts (verbs) are shown above the chart, since students need that to find the stem.
- **Translation & Analysis** (`translate.html`) — 80 practice sentences (30 short textbook-quoted examples, attributed to their exact chapter/exercise, plus 50 original sentences built from the same vocabulary). For each sentence: case/number/gender above nouns and pronouns, person/number above verbs, and a usage/role tag below each — with a separate "which noun does this agree with" dropdown under adjectives. A free-text box lets students attempt their own English translation before revealing a model translation.

## Data sources

- `data/vocabulary.js` — 190 words, Chapters 1–10, cross-checked against the textbook's own "Vocabulary to Learn" lists.
- `data/sentences.js` — 80 sentences with full word-by-word grammatical analysis (case, number, gender, person, syntactic role, adjective agreement) used to grade the Translation section. Textbook-quoted sentences are kept short and individually attributed, in line with fair-use practice for a classroom tool.
- `data/emoji.js` — a small visual mnemonic (emoji) per vocabulary word, shown on the flashcard back.

## Running locally

Just open `index.html` in a browser — everything is plain HTML/CSS/JS with no build step. If your browser blocks `fetch`/module loading from `file://`, serve the folder instead:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In the repo's **Settings → Pages**, set the source to **Deploy from a branch** → `main` / root. Every push to `main` redeploys automatically.
3. The site will be live at `https://<username>.github.io/<repo-name>/` within a few minutes.

## Extending it

- Add more vocabulary: append rows to `data/vocabulary.js` (same shape as existing entries — `chapter`, `pos`, `latin`, `genitive`, `principal_parts`, `gender`, `declension`, `conjugation`, `english`).
- Add more sentences: append entries to `data/sentences.js`. Each sentence is tokenized word-by-word; see existing entries for the schema (`p` = part of speech: `n`/`pn`/`adj`/`v`/`vinf`/`prep`/`conj`/`adv`/`punct`).
- Grammar chart word-pickers and the flashcard deck both read directly from `data/vocabulary.js`, so new words show up automatically as long as `declension`/`conjugation`/`gender` are filled in correctly.

## Note on this copy

This project was rebuilt from conversation history after the working files were lost to an environment cleanup. Everything reconstructed exactly except: the precise textbook page/exercise citation for 24 of the 30 "Textbook Quote" sentences (Chapters 3–10) — those `source` fields are clearly marked as unverified placeholders in `data/sentences.js` rather than guessed page numbers. If you still have the original `sentences.xlsx`, those citations can be restored from it.
