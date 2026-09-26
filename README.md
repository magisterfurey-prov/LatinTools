# Latin Practice — LFNM Levels 1 and 2 (static edition)

> **This is the static, backend-free fork.** It runs entirely in the browser on GitHub Pages: no login, no class rosters, no server. Progress is saved only in each student's own browser (`localStorage`). The full version with Google sign-in and teacher dashboards lives in a separate project.

A free, static practice site for *Latin for the New Millennium*, Level 1 (Chapters 1–21) and Level 2 (Chapters 1–15): vocabulary flashcards, grammar charts, and sentence analysis. No backend, no build step, no dependencies — just HTML/CSS/JS, so it runs directly on GitHub Pages.

## Choosing a book

A **Book: Level 1 / Level 2** switch in the header of every page chooses which textbook all three sections use. The choice is remembered in the browser, and a link ending in `?book=2` (e.g. `flashcards.html?book=2`) opens straight into Level 2 — handy for sharing with a class. `js/book.js` handles the switch and loads that book's data.

## Sections

- **Vocabulary** (`flashcards.html`) — Quizlet-style flashcards (Latin front, English + gender on the back, with a small emoji visual mnemonic) and a multiple-choice Learning Mode. Wrong answers are re-queued until every word in the chosen chapters has been answered correctly once. A **Test** mode gives a fixed 10-question multiple-choice quiz (no re-queuing, mixed Latin→English and English→Latin) and shows the score at the end. Noun fronts show the genitive singular; verb fronts (Ch. 2+) show all principal parts, matching standard dictionary citation form.
- **Grammar Charts** (`grammar.html`) — Fill-in-the-blank declension and conjugation charts (1st–5th declension nouns including 3rd declension i-stems and 4th declension neuters, 1st/2nd and 3rd declension adjectives, and verb conjugations for all five conjugation types in all six tenses — present, imperfect, future, perfect, pluperfect, future perfect — active and passive, plus sum and possum). Each verb chart notes the chapter where the textbook introduces that tense. Passive charts leave out intransitive verbs (no "ambulor"), faciō's present-system passive (fīō isn't taught in Level 1), and verbs without a fourth principal part; semi-deponent soleō is left out of the perfect system. Pick any word from the vocabulary list, fill in the chart, and check your work — incorrect cells are flagged but never filled in for you. Forms are generated on the fly by `js/morphology.js` from each word's headword/genitive/principal parts, not hand-typed, so every regular word in the list is chartable. With Level 2 selected, the charts use the words of both books and add the Level 2 paradigms: a Mood menu (indicative / subjunctive) on every verb chart, deponent verbs, irregular verbs (sum, possum, volō, nōlō, mālō, eō, ferō, fīō, and compounds such as redeō, referō, absum), adjectives with genitive in -īus (ūnus, sōlus, tōtus …), comparative adjectives, comparison of adjectives and adverbs, present active participles, gerunds, and demonstrative/intensive/relative pronouns (is, hic, ille, iste, īdem, ipse, quī). Every generated form was checked against the paradigm tables in the Level 2 appendix. Irregular or defective words (e.g. domus, vīs, alius, nōlō) are left out of the word-pickers rather than charted with wrong forms. The genitive singular (nouns) or full principal parts (verbs) are shown above the chart, since students need that to find the stem.
- **Translation & Analysis** (`translate.html`) — 168 practice sentences, eight per chapter: for Chapters 1–10, 30 short textbook-quoted examples plus 50 original sentences; for Chapters 11–21, 88 original sentences themed on each chapter's reading and built around its new grammar. For each sentence: case/number/gender above nouns and pronouns, person/number above verbs (plus tense from Chapter 11 on), and a usage/role tag below each — with a separate "which noun does this agree with" dropdown under adjectives and a "refers to" (antecedent) dropdown under relative pronouns. A free-text box lets students attempt their own English translation before revealing a model translation. Level 2 adds 120 original sentences (eight per chapter, themed on each chapter's reading); their verbs also ask for the mood, subjunctive verbs are tagged with why they are subjunctive (volitive, optative, purpose, result, indirect question, indirect command, cum, causal, concessive, conditional), and the usage list adds the ablative absolute, ablative of comparison, dative of agent, and place constructions with the names of towns (locative, accusative of place to which).

## Data sources

- `data/vocabulary.js` — 425 words, Chapters 1–21, cross-checked against the textbook's own "Vocabulary to Learn" lists.
- `data/sentences.js` — 168 sentences with full word-by-word grammatical analysis (case, number, gender, person, tense, syntactic role, adjective agreement, relative-pronoun antecedent) used to grade the Translation section. Textbook-quoted sentences are kept short and individually attributed, in line with fair-use practice for a classroom tool.
- `data/emoji.js` — a small visual mnemonic (emoji) per vocabulary word, shown on the flashcard back.
- `data/level2/` — the same three files for Level 2: 332 words from the Chapters 1–15 "Vocabulary to Learn" lists (abbreviated genitives and principal parts written out in full), 120 original sentences, and their emoji.

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
