# Latin Study Tools

A self-contained, GitHub Pages–hosted website for practicing Latin vocabulary, grammar paradigms, and sentence translation/parsing — built for a Latin for the New Millennium, Level 1 course, but easy to relabel for any first-year Latin class.

No build step, no server, no database, no accounts. It's plain HTML/CSS/JavaScript, so it runs directly from GitHub Pages (or any static host, or even by double-clicking `index.html` on your own computer).

## The three sections

- **Flashcards** (`flashcards.html`) — flip-card study of vocabulary by chapter, plus a multiple-choice quiz mode and a typing quiz mode. Latin→English or English→Latin. Each student's "know it" / "still learning" progress is saved in their own browser (see *About student data* below).
- **Grammar Charts** (`grammar.html`) — blank noun, adjective, and verb paradigm charts. Students type in the forms from memory and get instant right/wrong feedback per cell, a running score, and a "reveal answers" option. Typed answers don't need macrons (long marks) to be marked correct.
- **Translation** (`translation.html`) — a Latin sentence is shown; students parse the key words (case/number/gender for nouns and adjectives, person/number/tense/voice/mood for verbs), label how each word is used in the sentence (Subject, Direct Object, etc.), and then type a full English translation. Parsing and usage are graded exactly; translation is graded leniently (exact match to one of your listed model answers counts as "Correct," otherwise the model answer(s) are shown so the student can self-check).

## Publishing it on GitHub Pages

1. Create a new repository on GitHub (public, unless you have GitHub Pages available for private repos on your plan) and upload every file in this folder, keeping the folder structure intact (`css/`, `js/`, `data/`, and the `.html` files all in the repo root).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch," choose the `main` branch and the `/ (root)` folder, then save.
4. GitHub will publish the site at a URL like `https://<your-username>.github.io/<repo-name>/` within a minute or two. Share that link with students.
5. Any time you edit a file and push the change, the live site updates automatically (usually within a minute).

You can also just open `index.html` directly in a browser to preview locally before publishing — everything works without a server. (Some browsers restrict local file access slightly; if a page looks broken when opened directly from disk, running a tiny local server fixes it — e.g. `python3 -m http.server` from this folder, then visiting `http://localhost:8000`.)

## Adding your own content

Everything a student sees comes from three data files. You never need to touch the page layout to add words, charts, or sentences.

### 1. Vocabulary — `data/vocabulary.js`

Edit `window.VOCAB_DATA` directly, following the field reference in the comment at the top of the file, **or** open `vocab-import.html` in a browser:

- Paste a simple two-column list (Latin + English, one pair per line — this is exactly what a Quizlet "export" gives you), pick a chapter label, and it generates ready-to-paste entries.
- Or paste a full CSV with a header row (`latin,english,pos,gender,declension,conjugation,chapter,notes`) for more control.

Either way, copy the generated block into `data/vocabulary.js` just before the closing `];`. `vocab-import.html` isn't linked from the student navigation — it's a standalone teacher tool (there's a small link to it at the bottom of the home page).

The sample vocabulary currently in the file ("Chapter 1" / "Chapter 2") is placeholder data to demonstrate the format — replace it with your real chapter lists.

### 2. Grammar charts — `data/grammarCharts.js`

Each entry defines one fill-in-the-blank paradigm (a noun declension, an adjective declension, or a verb conjugation across present/imperfect/future). To add a new one, copy the closest existing entry and edit the label and the `answers` arrays — the comment at the top of the file explains the shape. The included set covers:

- Nouns: 1st declension, 2nd declension (-us and -er), 2nd declension neuter, 3rd declension, 3rd declension neuter
- Adjectives: 1st/2nd declension (bonus, -a, -um), 3rd declension two-termination (fortis, forte)
- Verbs (active indicative, present system): all four conjugations, 3rd conjugation -iō, and irregular *sum*

Grading strips macrons before comparing, so students can type `puellae` for `puellae` without needing the long mark.

### 3. Translation sentences — `data/sentences.js`

Each sentence lists the words you want quizzed, the correct parse for each (which dropdowns appear depends on the word's part of speech — see `PARSE_FIELD_DEFS` in the same file), an optional "usage" answer (must match one of the entries in `USAGE_OPTIONS`, which you can also extend), and a list of acceptable English translations. The comment block at the top of the file walks through every field. Three worked sample sentences are included as templates — replace them with your own as you build out sentences for each chapter/unit.

## About student data

There's no backend — this is static HTML/CSS/JS only. Flashcard "known" status and any in-progress answers live in each student's browser via `localStorage`, tied to that specific browser/device. That means:

- Nothing is collected or visible to you as the teacher; there's no way to see a roster of student scores from this site as built.
- A student's progress won't follow them if they switch computers or clear their browser data.
- If you want to collect scores centrally later, that would require adding a backend (e.g. a Google Form for a "final answer" submission, or a small hosted service) — not included here.

## Checking your data for typos

`verify_data.js` is a small optional script (needs [Node.js](https://nodejs.org) installed) that checks your data files for common mistakes before you publish — mismatched chart columns, a translation-sentence word whose parse answer isn't a valid option, a usage label that doesn't match `USAGE_OPTIONS`, duplicate chart IDs, and so on. After editing any file in `data/`, run:

```
node verify_data.js
```

from this folder. It prints what it checked and lists any problems it finds; it isn't used by the website itself, so it's safe to ignore or delete if you don't use Node.

## Customizing the look

Colors, fonts, and spacing are all controlled by CSS variables at the top of `css/style.css` (`--color-primary`, `--color-accent`, etc.) — change those to match your school's colors without touching any other file.
