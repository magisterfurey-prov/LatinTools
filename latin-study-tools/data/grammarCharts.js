/* ==========================================================================
   GRAMMAR CHART DATA
   ==========================================================================
   Each chart is a blank paradigm the student fills in from memory. Typed
   answers are checked without requiring macrons (long marks) — see
   LatinTools.normalizeLatin in js/main.js — but the "answers" below are
   written WITH macrons so the correct-answer reveal shows proper spelling.

   To add a new chart: copy an existing entry in the matching category
   (nouns / adjectives / verbs) and edit the label + answers. Every row's
   "answers" array must have exactly one entry per column, in the same
   order as that chart's "colsHeader" (or per gender-block for adjectives).
   ========================================================================== */

window.GRAMMAR_CHARTS = {

  nouns: [
    {
      id: "decl1-puella",
      label: "1st Declension — puella, puellae (f.) “girl”",
      colsHeader: ["Singular", "Plural"],
      rows: [
        { label: "Nominative", answers: ["puella", "puellae"] },
        { label: "Genitive", answers: ["puellae", "puellārum"] },
        { label: "Dative", answers: ["puellae", "puellīs"] },
        { label: "Accusative", answers: ["puellam", "puellās"] },
        { label: "Ablative", answers: ["puellā", "puellīs"] },
        { label: "Vocative", answers: ["puella", "puellae"] }
      ]
    },
    {
      id: "decl2-dominus",
      label: "2nd Declension (-us) — dominus, dominī (m.) “master”",
      colsHeader: ["Singular", "Plural"],
      rows: [
        { label: "Nominative", answers: ["dominus", "dominī"] },
        { label: "Genitive", answers: ["dominī", "dominōrum"] },
        { label: "Dative", answers: ["dominō", "dominīs"] },
        { label: "Accusative", answers: ["dominum", "dominōs"] },
        { label: "Ablative", answers: ["dominō", "dominīs"] },
        { label: "Vocative", answers: ["domine", "dominī"] }
      ]
    },
    {
      id: "decl2-puer",
      label: "2nd Declension (-er) — puer, puerī (m.) “boy”",
      colsHeader: ["Singular", "Plural"],
      rows: [
        { label: "Nominative", answers: ["puer", "puerī"] },
        { label: "Genitive", answers: ["puerī", "puerōrum"] },
        { label: "Dative", answers: ["puerō", "puerīs"] },
        { label: "Accusative", answers: ["puerum", "puerōs"] },
        { label: "Ablative", answers: ["puerō", "puerīs"] },
        { label: "Vocative", answers: ["puer", "puerī"] }
      ]
    },
    {
      id: "decl2-bellum",
      label: "2nd Declension Neuter — bellum, bellī (n.) “war”",
      colsHeader: ["Singular", "Plural"],
      rows: [
        { label: "Nominative", answers: ["bellum", "bella"] },
        { label: "Genitive", answers: ["bellī", "bellōrum"] },
        { label: "Dative", answers: ["bellō", "bellīs"] },
        { label: "Accusative", answers: ["bellum", "bella"] },
        { label: "Ablative", answers: ["bellō", "bellīs"] },
        { label: "Vocative", answers: ["bellum", "bella"] }
      ]
    },
    {
      id: "decl3-rex",
      label: "3rd Declension — rēx, rēgis (m.) “king”",
      colsHeader: ["Singular", "Plural"],
      rows: [
        { label: "Nominative", answers: ["rēx", "rēgēs"] },
        { label: "Genitive", answers: ["rēgis", "rēgum"] },
        { label: "Dative", answers: ["rēgī", "rēgibus"] },
        { label: "Accusative", answers: ["rēgem", "rēgēs"] },
        { label: "Ablative", answers: ["rēge", "rēgibus"] },
        { label: "Vocative", answers: ["rēx", "rēgēs"] }
      ]
    },
    {
      id: "decl3-nomen",
      label: "3rd Declension Neuter — nōmen, nōminis (n.) “name”",
      colsHeader: ["Singular", "Plural"],
      rows: [
        { label: "Nominative", answers: ["nōmen", "nōmina"] },
        { label: "Genitive", answers: ["nōminis", "nōminum"] },
        { label: "Dative", answers: ["nōminī", "nōminibus"] },
        { label: "Accusative", answers: ["nōmen", "nōmina"] },
        { label: "Ablative", answers: ["nōmine", "nōminibus"] },
        { label: "Vocative", answers: ["nōmen", "nōmina"] }
      ]
    }
  ],

  adjectives: [
    {
      id: "adj-bonus",
      label: "1st/2nd Declension Adjective — bonus, bona, bonum “good”",
      blocks: [
        {
          label: "Masculine",
          colsHeader: ["Singular", "Plural"],
          rows: [
            { label: "Nominative", answers: ["bonus", "bonī"] },
            { label: "Genitive", answers: ["bonī", "bonōrum"] },
            { label: "Dative", answers: ["bonō", "bonīs"] },
            { label: "Accusative", answers: ["bonum", "bonōs"] },
            { label: "Ablative", answers: ["bonō", "bonīs"] }
          ]
        },
        {
          label: "Feminine",
          colsHeader: ["Singular", "Plural"],
          rows: [
            { label: "Nominative", answers: ["bona", "bonae"] },
            { label: "Genitive", answers: ["bonae", "bonārum"] },
            { label: "Dative", answers: ["bonae", "bonīs"] },
            { label: "Accusative", answers: ["bonam", "bonās"] },
            { label: "Ablative", answers: ["bonā", "bonīs"] }
          ]
        },
        {
          label: "Neuter",
          colsHeader: ["Singular", "Plural"],
          rows: [
            { label: "Nominative", answers: ["bonum", "bona"] },
            { label: "Genitive", answers: ["bonī", "bonōrum"] },
            { label: "Dative", answers: ["bonō", "bonīs"] },
            { label: "Accusative", answers: ["bonum", "bona"] },
            { label: "Ablative", answers: ["bonō", "bonīs"] }
          ]
        }
      ]
    },
    {
      id: "adj-fortis",
      label: "3rd Declension Adjective (two-termination) — fortis, forte “brave”",
      blocks: [
        {
          label: "Masculine / Feminine",
          colsHeader: ["Singular", "Plural"],
          rows: [
            { label: "Nominative", answers: ["fortis", "fortēs"] },
            { label: "Genitive", answers: ["fortis", "fortium"] },
            { label: "Dative", answers: ["fortī", "fortibus"] },
            { label: "Accusative", answers: ["fortem", "fortēs"] },
            { label: "Ablative", answers: ["fortī", "fortibus"] }
          ]
        },
        {
          label: "Neuter",
          colsHeader: ["Singular", "Plural"],
          rows: [
            { label: "Nominative", answers: ["forte", "fortia"] },
            { label: "Genitive", answers: ["fortis", "fortium"] },
            { label: "Dative", answers: ["fortī", "fortibus"] },
            { label: "Accusative", answers: ["forte", "fortia"] },
            { label: "Ablative", answers: ["fortī", "fortibus"] }
          ]
        }
      ]
    }
  ],

  verbs: [
    {
      id: "conj1-amo",
      label: "1st Conjugation — amō, amāre, amāvī, amātum “to love” (active indicative)",
      colsHeader: ["Present", "Imperfect", "Future"],
      rows: [
        { label: "1st sg (I ___)", answers: ["amō", "amābam", "amābō"] },
        { label: "2nd sg (you ___)", answers: ["amās", "amābās", "amābis"] },
        { label: "3rd sg (he/she/it ___)", answers: ["amat", "amābat", "amābit"] },
        { label: "1st pl (we ___)", answers: ["amāmus", "amābāmus", "amābimus"] },
        { label: "2nd pl (y'all ___)", answers: ["amātis", "amābātis", "amābitis"] },
        { label: "3rd pl (they ___)", answers: ["amant", "amābant", "amābunt"] }
      ]
    },
    {
      id: "conj2-moneo",
      label: "2nd Conjugation — moneō, monēre, monuī, monitum “to warn/advise” (active indicative)",
      colsHeader: ["Present", "Imperfect", "Future"],
      rows: [
        { label: "1st sg (I ___)", answers: ["moneō", "monēbam", "monēbō"] },
        { label: "2nd sg (you ___)", answers: ["monēs", "monēbās", "monēbis"] },
        { label: "3rd sg (he/she/it ___)", answers: ["monet", "monēbat", "monēbit"] },
        { label: "1st pl (we ___)", answers: ["monēmus", "monēbāmus", "monēbimus"] },
        { label: "2nd pl (y'all ___)", answers: ["monētis", "monēbātis", "monēbitis"] },
        { label: "3rd pl (they ___)", answers: ["monent", "monēbant", "monēbunt"] }
      ]
    },
    {
      id: "conj3-duco",
      label: "3rd Conjugation — dūcō, dūcere, dūxī, ductum “to lead” (active indicative)",
      colsHeader: ["Present", "Imperfect", "Future"],
      rows: [
        { label: "1st sg (I ___)", answers: ["dūcō", "dūcēbam", "dūcam"] },
        { label: "2nd sg (you ___)", answers: ["dūcis", "dūcēbās", "dūcēs"] },
        { label: "3rd sg (he/she/it ___)", answers: ["dūcit", "dūcēbat", "dūcet"] },
        { label: "1st pl (we ___)", answers: ["dūcimus", "dūcēbāmus", "dūcēmus"] },
        { label: "2nd pl (y'all ___)", answers: ["dūcitis", "dūcēbātis", "dūcētis"] },
        { label: "3rd pl (they ___)", answers: ["dūcunt", "dūcēbant", "dūcent"] }
      ]
    },
    {
      id: "conj3io-capio",
      label: "3rd Conjugation -iō — capiō, capere, cēpī, captum “to take/capture” (active indicative)",
      colsHeader: ["Present", "Imperfect", "Future"],
      rows: [
        { label: "1st sg (I ___)", answers: ["capiō", "capiēbam", "capiam"] },
        { label: "2nd sg (you ___)", answers: ["capis", "capiēbās", "capiēs"] },
        { label: "3rd sg (he/she/it ___)", answers: ["capit", "capiēbat", "capiet"] },
        { label: "1st pl (we ___)", answers: ["capimus", "capiēbāmus", "capiēmus"] },
        { label: "2nd pl (y'all ___)", answers: ["capitis", "capiēbātis", "capiētis"] },
        { label: "3rd pl (they ___)", answers: ["capiunt", "capiēbant", "capient"] }
      ]
    },
    {
      id: "conj4-audio",
      label: "4th Conjugation — audiō, audīre, audīvī, audītum “to hear” (active indicative)",
      colsHeader: ["Present", "Imperfect", "Future"],
      rows: [
        { label: "1st sg (I ___)", answers: ["audiō", "audiēbam", "audiam"] },
        { label: "2nd sg (you ___)", answers: ["audīs", "audiēbās", "audiēs"] },
        { label: "3rd sg (he/she/it ___)", answers: ["audit", "audiēbat", "audiet"] },
        { label: "1st pl (we ___)", answers: ["audīmus", "audiēbāmus", "audiēmus"] },
        { label: "2nd pl (y'all ___)", answers: ["audītis", "audiēbātis", "audiētis"] },
        { label: "3rd pl (they ___)", answers: ["audiunt", "audiēbant", "audient"] }
      ]
    },
    {
      id: "irreg-sum",
      label: "Irregular — sum, esse, fuī, futūrum “to be”",
      colsHeader: ["Present", "Imperfect", "Future"],
      rows: [
        { label: "1st sg (I ___)", answers: ["sum", "eram", "erō"] },
        { label: "2nd sg (you ___)", answers: ["es", "erās", "eris"] },
        { label: "3rd sg (he/she/it ___)", answers: ["est", "erat", "erit"] },
        { label: "1st pl (we ___)", answers: ["sumus", "erāmus", "erimus"] },
        { label: "2nd pl (y'all ___)", answers: ["estis", "erātis", "eritis"] },
        { label: "3rd pl (they ___)", answers: ["sunt", "erant", "erunt"] }
      ]
    }
  ]
};
