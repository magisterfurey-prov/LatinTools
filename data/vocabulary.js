/* ==========================================================================
   VOCABULARY DATA — SAMPLE SET
   ==========================================================================
   This is placeholder vocabulary so you can see the format and test the
   flashcards page. Replace it with your own chapter-by-chapter word lists.

   Easiest ways to fill this in for real:
     1) Edit this file by hand, following the pattern below, OR
     2) Open vocab-import.html in the browser, paste a CSV/TSV list
        (e.g. exported from a spreadsheet or Quizlet set), and it will
        generate a properly formatted block you can paste in here.

   FIELD REFERENCE
   ----------------
   id            - any unique string (used internally, students never see it)
   latin         - the headword as you want it to appear on the flashcard.
                   For nouns, the convention is "nominative, genitive"
                   (e.g. "puella, puellae"). For verbs, the four principal
                   parts (e.g. "amō, amāre, amāvī, amātum").
   english       - the English meaning shown on the back of the card.
   pos           - one of: "noun", "verb", "adjective", "pronoun",
                   "preposition", "adverb", "conjunction", "other"
   gender        - for nouns/adjectives: "m", "f", "n", or "m/f" (leave "" if N/A)
   declension    - for nouns/adjectives: 1, 2, 3, 4, 5 (leave null if N/A)
   conjugation   - for verbs: 1, 2, 3, "3io", 4, or "irregular" (leave null if N/A)
   chapter       - a label used to filter flashcards/quizzes, e.g. "Chapter 1".
                   Use whatever labels match how you want to group study sets.
   notes         - optional extra info shown in small text on the card back
                   (irregular forms, usage notes, etc.) — leave "" if none.

   You can add or remove fields per word (e.g. skip principal-parts
   detail) — the flashcards page only ever looks at latin/english/chapter/
   pos/notes, so extra structure here is mainly useful for your own
   reference and for building grammar/translation exercises later.
   ========================================================================== */

window.VOCAB_DATA = [
  // ---- Chapter 1 (sample) ----
  { id: "n001", latin: "puella, puellae", english: "girl", pos: "noun", gender: "f", declension: 1, conjugation: null, chapter: "Chapter 1", notes: "1st declension" },
  { id: "n002", latin: "agricola, agricolae", english: "farmer", pos: "noun", gender: "m", declension: 1, conjugation: null, chapter: "Chapter 1", notes: "1st declension, masculine" },
  { id: "n003", latin: "dominus, dominī", english: "master, lord", pos: "noun", gender: "m", declension: 2, conjugation: null, chapter: "Chapter 1", notes: "2nd declension" },
  { id: "n004", latin: "puer, puerī", english: "boy", pos: "noun", gender: "m", declension: 2, conjugation: null, chapter: "Chapter 1", notes: "2nd declension, -er noun" },
  { id: "n005", latin: "bellum, bellī", english: "war", pos: "noun", gender: "n", declension: 2, conjugation: null, chapter: "Chapter 1", notes: "2nd declension neuter" },
  { id: "n006", latin: "magister, magistrī", english: "teacher (male)", pos: "noun", gender: "m", declension: 2, conjugation: null, chapter: "Chapter 1", notes: "" },
  { id: "n007", latin: "magistra, magistrae", english: "teacher (female)", pos: "noun", gender: "f", declension: 1, conjugation: null, chapter: "Chapter 1", notes: "" },
  { id: "a001", latin: "bonus, bona, bonum", english: "good", pos: "adjective", gender: "m/f/n", declension: 1, conjugation: null, chapter: "Chapter 1", notes: "1st/2nd declension adjective" },
  { id: "a002", latin: "magnus, magna, magnum", english: "big, great", pos: "adjective", gender: "m/f/n", declension: 1, conjugation: null, chapter: "Chapter 1", notes: "1st/2nd declension adjective" },
  { id: "v001", latin: "amō, amāre, amāvī, amātum", english: "to love, like", pos: "verb", gender: "", declension: null, conjugation: 1, chapter: "Chapter 1", notes: "1st conjugation" },
  { id: "v002", latin: "videō, vidēre, vīdī, vīsum", english: "to see", pos: "verb", gender: "", declension: null, conjugation: 2, chapter: "Chapter 1", notes: "2nd conjugation" },
  { id: "v003", latin: "sum, esse, fuī, futūrum", english: "to be", pos: "verb", gender: "", declension: null, conjugation: "irregular", chapter: "Chapter 1", notes: "irregular" },
  { id: "p001", latin: "in", english: "in, on (+ abl.); into, onto (+ acc.)", pos: "preposition", gender: "", declension: null, conjugation: null, chapter: "Chapter 1", notes: "takes ablative or accusative" },
  { id: "adv001", latin: "nōn", english: "not", pos: "adverb", gender: "", declension: null, conjugation: null, chapter: "Chapter 1", notes: "" },

  // ---- Chapter 2 (sample) ----
  { id: "n008", latin: "servus, servī", english: "slave, servant", pos: "noun", gender: "m", declension: 2, conjugation: null, chapter: "Chapter 2", notes: "" },
  { id: "n009", latin: "filius, filiī", english: "son", pos: "noun", gender: "m", declension: 2, conjugation: null, chapter: "Chapter 2", notes: "" },
  { id: "n010", latin: "filia, filiae", english: "daughter", pos: "noun", gender: "f", declension: 1, conjugation: null, chapter: "Chapter 2", notes: "dative/ablative plural: filiābus" },
  { id: "n011", latin: "rēx, rēgis", english: "king", pos: "noun", gender: "m", declension: 3, conjugation: null, chapter: "Chapter 2", notes: "3rd declension" },
  { id: "n012", latin: "nōmen, nōminis", english: "name", pos: "noun", gender: "n", declension: 3, conjugation: null, chapter: "Chapter 2", notes: "3rd declension neuter" },
  { id: "n013", latin: "verbum, verbī", english: "word", pos: "noun", gender: "n", declension: 2, conjugation: null, chapter: "Chapter 2", notes: "" },
  { id: "a003", latin: "fortis, forte", english: "brave, strong", pos: "adjective", gender: "m/f/n", declension: 3, conjugation: null, chapter: "Chapter 2", notes: "3rd declension adjective, two endings" },
  { id: "v004", latin: "dūcō, dūcere, dūxī, ductum", english: "to lead", pos: "verb", gender: "", declension: null, conjugation: 3, chapter: "Chapter 2", notes: "3rd conjugation" },
  { id: "v005", latin: "capiō, capere, cēpī, captum", english: "to take, capture", pos: "verb", gender: "", declension: null, conjugation: "3io", chapter: "Chapter 2", notes: "3rd conjugation -iō" },
  { id: "v006", latin: "audiō, audīre, audīvī, audītum", english: "to hear", pos: "verb", gender: "", declension: null, conjugation: 4, chapter: "Chapter 2", notes: "4th conjugation" },
  { id: "pr001", latin: "is, ea, id", english: "he, she, it / this, that", pos: "pronoun", gender: "m/f/n", declension: null, conjugation: null, chapter: "Chapter 2", notes: "demonstrative/personal pronoun" },
  { id: "c001", latin: "et", english: "and", pos: "conjunction", gender: "", declension: null, conjugation: null, chapter: "Chapter 2", notes: "" }
];
