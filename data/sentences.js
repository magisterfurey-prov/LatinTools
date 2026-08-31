/* ==========================================================================
   TRANSLATION SENTENCE DATA — SAMPLE SET
   ==========================================================================
   These are placeholder sentences (built from the sample vocabulary in
   data/vocabulary.js) so you can see the format and test the translation
   page. Replace/add sentences to match what you're actually covering.

   SCHEMA for each sentence:
     id                     - unique string
     reference              - short label (chapter, textbook page, etc.)
     latin                  - the full sentence as shown to students
     words                  - array of words the student must parse (skip
                              minor words like "et"/"non" that you don't
                              want quizzed — they still appear in the
                              sentence itself, just without a parse box)
       text                 - the word exactly as it appears in the sentence
       pos                  - "noun" | "adjective" | "pronoun" | "verb"
                              (controls which dropdowns appear — see
                              PARSE_FIELD_DEFS below)
       parse                - the correct answer for each dropdown field,
                              keyed by field name (see PARSE_FIELD_DEFS)
       usage                - (optional) correct answer for the "how is
                              this word used in the sentence" dropdown —
                              must exactly match one entry in USAGE_OPTIONS.
                              Omit this key entirely if you don't want a
                              usage question for that word (e.g. most verbs).
     acceptableTranslations - array of English translations that count as
                              fully correct. Translation grading is exact
                              (after ignoring case/punctuation), so list a
                              few natural phrasings. If a student's answer
                              doesn't match any of them, the page shows
                              these as model answers for the student to
                              self-check against rather than just marking
                              it wrong outright.
   ========================================================================== */

window.USAGE_OPTIONS = [
  "Subject",
  "Direct Object",
  "Indirect Object",
  "Predicate Nominative",
  "Predicate Adjective",
  "Attributive Adjective",
  "Object of a Preposition",
  "Genitive of Possession",
  "Ablative of Means",
  "Ablative of Manner",
  "Ablative of Time When",
  "Dative of Reference",
  "Direct Address (Vocative)",
  "Appositive"
];

window.PARSE_FIELD_DEFS = {
  noun: [
    { key: "case", label: "Case", options: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative", "Vocative"] },
    { key: "number", label: "Number", options: ["Singular", "Plural"] },
    { key: "gender", label: "Gender", options: ["Masculine", "Feminine", "Neuter"] }
  ],
  pronoun: [
    { key: "case", label: "Case", options: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative", "Vocative"] },
    { key: "number", label: "Number", options: ["Singular", "Plural"] },
    { key: "gender", label: "Gender", options: ["Masculine", "Feminine", "Neuter"] }
  ],
  adjective: [
    { key: "case", label: "Case", options: ["Nominative", "Genitive", "Dative", "Accusative", "Ablative", "Vocative"] },
    { key: "number", label: "Number", options: ["Singular", "Plural"] },
    { key: "gender", label: "Gender", options: ["Masculine", "Feminine", "Neuter"] }
  ],
  verb: [
    { key: "person", label: "Person", options: ["1st", "2nd", "3rd"] },
    { key: "number", label: "Number", options: ["Singular", "Plural"] },
    { key: "tense", label: "Tense", options: ["Present", "Imperfect", "Future", "Perfect", "Pluperfect", "Future Perfect"] },
    { key: "voice", label: "Voice", options: ["Active", "Passive"] },
    { key: "mood", label: "Mood", options: ["Indicative", "Subjunctive", "Imperative", "Infinitive"] }
  ]
};

window.SENTENCE_DATA = [
  {
    id: "s1",
    reference: "Sample sentence 1",
    latin: "Puella magistram videt.",
    words: [
      { text: "Puella", pos: "noun", parse: { case: "Nominative", number: "Singular", gender: "Feminine" }, usage: "Subject" },
      { text: "magistram", pos: "noun", parse: { case: "Accusative", number: "Singular", gender: "Feminine" }, usage: "Direct Object" },
      { text: "videt", pos: "verb", parse: { person: "3rd", number: "Singular", tense: "Present", voice: "Active", mood: "Indicative" } }
    ],
    acceptableTranslations: [
      "The girl sees the teacher.",
      "The girl is seeing the teacher.",
      "A girl sees the teacher.",
      "A girl sees a teacher."
    ]
  },
  {
    id: "s2",
    reference: "Sample sentence 2",
    latin: "Servus dominum non amat.",
    words: [
      { text: "Servus", pos: "noun", parse: { case: "Nominative", number: "Singular", gender: "Masculine" }, usage: "Subject" },
      { text: "dominum", pos: "noun", parse: { case: "Accusative", number: "Singular", gender: "Masculine" }, usage: "Direct Object" },
      { text: "amat", pos: "verb", parse: { person: "3rd", number: "Singular", tense: "Present", voice: "Active", mood: "Indicative" } }
    ],
    acceptableTranslations: [
      "The slave does not love the master.",
      "The slave doesn't love the master.",
      "The slave does not love his master."
    ]
  },
  {
    id: "s3",
    reference: "Sample sentence 3",
    latin: "Puer bonus agricolam videt.",
    words: [
      { text: "Puer", pos: "noun", parse: { case: "Nominative", number: "Singular", gender: "Masculine" }, usage: "Subject" },
      { text: "bonus", pos: "adjective", parse: { case: "Nominative", number: "Singular", gender: "Masculine" }, usage: "Attributive Adjective" },
      { text: "agricolam", pos: "noun", parse: { case: "Accusative", number: "Singular", gender: "Masculine" }, usage: "Direct Object" },
      { text: "videt", pos: "verb", parse: { person: "3rd", number: "Singular", tense: "Present", voice: "Active", mood: "Indicative" } }
    ],
    acceptableTranslations: [
      "The good boy sees the farmer.",
      "The good boy is seeing the farmer.",
      "A good boy sees the farmer."
    ]
  }
];
