/* Latin morphology engine: generates full noun/adjective/verb paradigms
   from the headword + genitive/principal-parts data already in vocabulary.js.
   Used only to check student answers -- never shown directly. */

// Nouns/adjectives whose 3rd-declension stem is an i-stem (beyond what's
// mechanically derivable). LFNM-level simplification: i-stems differ from
// regular 3rd declension only in gen. pl. -ium (masc/fem) and, for neuters,
// abl. sg. -i, nom./acc. pl. -ia, gen. pl. -ium.
const ISTEM_NOUNS_MF = new Set([
  'cīvis', 'hostis', 'urbs', 'mors', 'nox',
  'ignis', 'clādēs', 'classis', 'nāvis', 'nūbēs', 'pellis', 'axis', 'carō', 'mōns', 'pars',
]);
const ISTEM_NOUNS_N = new Set(['mare', 'animal', 'exemplar']);

const PLURAL_ONLY = new Set(['castra', 'arma', 'dēliciae', 'tenebrae', 'dīvitiae']);

// Nouns that don't follow their declension's regular paradigm, or whose
// full paradigm is theoretical -- excluded from chart word-pickers:
// domus mixes 2nd/4th declension forms; iussus occurs only as abl. sg.
// iussū; merīdiēs has no plural in practice; adulēscēns (gen. pl.
// adulēscentium/-um) and cor (gen. pl. rare) have unsettled genitive plurals.
const IRREGULAR_NOUNS = new Set(['domus', 'iussus', 'merīdiēs', 'adulēscēns', 'cor']);

// Cited in the plural because the singular is rarely/never used (e.g. paucī,
// paucae, pauca "few") -- excluded from chart word-pickers since a "singular"
// paradigm for these would be purely theoretical.
const PLURAL_ONLY_ADJ = new Set(['paucī, paucae, pauca']);

// Adjectives the regular generators would decline wrongly: alius and ūllus
// take the pronominal gen. sg. -īus / dat. sg. -ī; dīves and pauper are
// consonant stems (abl. sg. -e, gen. pl. -um) despite being 3rd declension.
const IRREGULAR_ADJ = new Set(['alius, alia, aliud', 'ūllus, ūlla, ūllum', 'dīves, dīvitis', 'pauper, pauperis']);

function isNeuterGender(g) {
  return !!g && g.replace(/\./g, '').split('/').includes('n');
}

function stemFromGenitive(genitive, endingLen) {
  return genitive.slice(0, genitive.length - endingLen);
}

// ---------- NOUNS ----------
function declineNoun(entry) {
  const { latin, genitive, gender, declension } = entry;
  const neuter = isNeuterGender(gender);
  const forms = { sg: {}, pl: {} };

  if (declension === '1st') {
    const stem = stemFromGenitive(genitive, 2); // strip "ae"
    forms.sg = { nom: latin, gen: stem + 'ae', dat: stem + 'ae', acc: stem + 'am', abl: stem + 'ā' };
    forms.pl = { nom: stem + 'ae', gen: stem + 'ārum', dat: stem + 'īs', acc: stem + 'ās', abl: stem + 'īs' };
    return forms;
  }

  if (declension === '2nd') {
    const stem = stemFromGenitive(genitive, 1); // strip "ī"
    if (neuter) {
      forms.sg = { nom: latin, gen: stem + 'ī', dat: stem + 'ō', acc: latin, abl: stem + 'ō' };
      forms.pl = { nom: stem + 'a', gen: stem + 'ōrum', dat: stem + 'īs', acc: stem + 'a', abl: stem + 'īs' };
    } else {
      forms.sg = { nom: latin, gen: stem + 'ī', dat: stem + 'ō', acc: stem + 'um', abl: stem + 'ō' };
      forms.pl = { nom: stem + 'ī', gen: stem + 'ōrum', dat: stem + 'īs', acc: stem + 'ōs', abl: stem + 'īs' };
    }
    return forms;
  }

  if (declension === '3rd') {
    const stem = stemFromGenitive(genitive, 2); // strip "is"
    const istem = ISTEM_NOUNS_MF.has(latin) || ISTEM_NOUNS_N.has(latin);
    const genPl = istem ? stem + 'ium' : stem + 'um';
    if (neuter) {
      const ablSg = ISTEM_NOUNS_N.has(latin) ? stem + 'ī' : stem + 'e';
      const nomAccPl = ISTEM_NOUNS_N.has(latin) ? stem + 'ia' : stem + 'a';
      forms.sg = { nom: latin, gen: stem + 'is', dat: stem + 'ī', acc: latin, abl: ablSg };
      forms.pl = { nom: nomAccPl, gen: genPl, dat: stem + 'ibus', acc: nomAccPl, abl: stem + 'ibus' };
    } else {
      forms.sg = { nom: latin, gen: stem + 'is', dat: stem + 'ī', acc: stem + 'em', abl: stem + 'e' };
      forms.pl = { nom: stem + 'ēs', gen: genPl, dat: stem + 'ibus', acc: stem + 'ēs', abl: stem + 'ibus' };
    }
    return forms;
  }

  if (declension === '4th') {
    const stem = stemFromGenitive(genitive, 2); // strip "ūs"
    if (neuter) {
      // cornū: dat. sg. is -ū, not -uī (the -uī dative is masc./fem. only)
      forms.sg = { nom: latin, gen: stem + 'ūs', dat: stem + 'ū', acc: latin, abl: stem + 'ū' };
      forms.pl = { nom: stem + 'ua', gen: stem + 'uum', dat: stem + 'ibus', acc: stem + 'ua', abl: stem + 'ibus' };
    } else {
      forms.sg = { nom: latin, gen: stem + 'ūs', dat: stem + 'uī', acc: stem + 'um', abl: stem + 'ū' };
      forms.pl = { nom: stem + 'ūs', gen: stem + 'uum', dat: stem + 'ibus', acc: stem + 'ūs', abl: stem + 'ibus' };
    }
    return forms;
  }

  if (declension === '5th') {
    // Gen./dat. sg. come straight from the genitive, since the -ēī/-eī
    // length depends on whether a vowel precedes it (diēī vs. reī).
    const stem = latin.slice(0, -2); // strip "ēs"
    forms.sg = { nom: latin, gen: genitive, dat: genitive, acc: stem + 'em', abl: stem + 'ē' };
    forms.pl = { nom: latin, gen: stem + 'ērum', dat: stem + 'ēbus', acc: latin, abl: stem + 'ēbus' };
    return forms;
  }

  return null;
}

function nounCategory(entry) {
  if (PLURAL_ONLY.has(entry.latin) || IRREGULAR_NOUNS.has(entry.latin)) return null;
  const { declension, gender, latin, genitive } = entry;
  const neuter = isNeuterGender(gender);
  if (declension === '1st') return '1st';
  if (declension === '2nd') {
    if (neuter) return '2nd-neuter';
    // -er nouns: nominative singular ends in -er/-ir and does NOT end in -us
    if (/(er|ir)$/.test(latin) && !/us$/.test(latin)) return '2nd-er';
    return '2nd-masc';
  }
  if (declension === '3rd') {
    const istem = ISTEM_NOUNS_MF.has(latin) || ISTEM_NOUNS_N.has(latin);
    if (neuter) return istem ? '3rd-istem' : '3rd-neuter';
    if (istem) return '3rd-istem';
    if (gender === 'f.') return '3rd-fem';
    return '3rd-masc';
  }
  if (declension === '4th') return neuter ? '4th-neuter' : '4th';
  if (declension === '5th') return '5th';
  return null;
}

// ---------- ADJECTIVES ----------
function declineAdjective(entry) {
  const parts = entry.latin.split(',').map(s => s.trim());
  const forms = { M: { sg: {}, pl: {} }, F: { sg: {}, pl: {} }, N: { sg: {}, pl: {} } };

  if (entry.declension === '1st') {
    // 1st/2nd declension, 3-termination: bonus, bona, bonum (also -er: pulcher, pulchra, pulchrum)
    const [nomM, nomF, nomN] = parts;
    let stem;
    if (nomM.endsWith('us')) stem = nomM.slice(0, -2);
    else if (nomM.endsWith('er')) stem = nomF.slice(0, -1); // strip final "a": miser/misera, pulcher/pulchra
    else stem = nomM.slice(0, -1); // plural-cited fallback (e.g. paucī): strip final "ī"
    forms.M.sg = { nom: nomM, gen: stem + 'ī', dat: stem + 'ō', acc: stem + 'um', abl: stem + 'ō' };
    forms.M.pl = { nom: stem + 'ī', gen: stem + 'ōrum', dat: stem + 'īs', acc: stem + 'ōs', abl: stem + 'īs' };
    forms.F.sg = { nom: nomF, gen: stem + 'ae', dat: stem + 'ae', acc: stem + 'am', abl: stem + 'ā' };
    forms.F.pl = { nom: stem + 'ae', gen: stem + 'ārum', dat: stem + 'īs', acc: stem + 'ās', abl: stem + 'īs' };
    forms.N.sg = { nom: nomN, gen: stem + 'ī', dat: stem + 'ō', acc: nomN, abl: stem + 'ō' };
    forms.N.pl = { nom: stem + 'a', gen: stem + 'ōrum', dat: stem + 'īs', acc: stem + 'a', abl: stem + 'īs' };
    return { type: '12', forms };
  }

  // 3rd declension adjectives -- always take -ī abl. sg., -ium gen. pl., -ia neut. nom/acc pl.
  if (entry.declension === '3rd' && parts.length === 3) {
    // 3-termination: ācer, ācris, ācre
    const [nomM, nomF, nomN] = parts;
    const stem = stemFromGenitive(nomF, 2); // strip "is"
    forms.M.sg = { nom: nomM, gen: stem + 'is', dat: stem + 'ī', acc: stem + 'em', abl: stem + 'ī' };
    forms.F.sg = { nom: nomF, gen: stem + 'is', dat: stem + 'ī', acc: stem + 'em', abl: stem + 'ī' };
    forms.M.pl = forms.F.pl = { nom: stem + 'ēs', gen: stem + 'ium', dat: stem + 'ibus', acc: stem + 'ēs', abl: stem + 'ibus' };
    forms.N.sg = { nom: nomN, gen: stem + 'is', dat: stem + 'ī', acc: nomN, abl: stem + 'ī' };
    forms.N.pl = { nom: stem + 'ia', gen: stem + 'ium', dat: stem + 'ibus', acc: stem + 'ia', abl: stem + 'ibus' };
    return { type: '3-3term', forms };
  }

  if (entry.declension === '3rd' && parts.length === 2 && parts[0].endsWith('is')) {
    // 2-termination: fortis, forte
    const [nomMF, nomN] = parts;
    const stem = stemFromGenitive(nomMF, 2); // strip "is"
    forms.M.sg = forms.F.sg = { nom: nomMF, gen: stem + 'is', dat: stem + 'ī', acc: stem + 'em', abl: stem + 'ī' };
    forms.M.pl = forms.F.pl = { nom: stem + 'ēs', gen: stem + 'ium', dat: stem + 'ibus', acc: stem + 'ēs', abl: stem + 'ibus' };
    forms.N.sg = { nom: nomN, gen: stem + 'is', dat: stem + 'ī', acc: nomN, abl: stem + 'ī' };
    forms.N.pl = { nom: stem + 'ia', gen: stem + 'ium', dat: stem + 'ibus', acc: stem + 'ia', abl: stem + 'ibus' };
    return { type: '3-2term', forms };
  }

  if (entry.declension === '3rd' && parts.length === 2) {
    // 1-termination: fēlīx, fēlīcis (nominative all genders, then genitive singular)
    const [nomAll, gen] = parts;
    const stem = stemFromGenitive(gen, 2); // strip "is"
    forms.M.sg = forms.F.sg = { nom: nomAll, gen: stem + 'is', dat: stem + 'ī', acc: stem + 'em', abl: stem + 'ī' };
    forms.M.pl = forms.F.pl = { nom: stem + 'ēs', gen: stem + 'ium', dat: stem + 'ibus', acc: stem + 'ēs', abl: stem + 'ibus' };
    forms.N.sg = { nom: nomAll, gen: stem + 'is', dat: stem + 'ī', acc: nomAll, abl: stem + 'ī' };
    forms.N.pl = { nom: stem + 'ia', gen: stem + 'ium', dat: stem + 'ibus', acc: stem + 'ia', abl: stem + 'ibus' };
    return { type: '3-1term', forms };
  }

  return null;
}

function adjectiveCategory(entry) {
  if (entry.pos !== 'Adjective') return null;
  if (PLURAL_ONLY_ADJ.has(entry.latin) || IRREGULAR_ADJ.has(entry.latin)) return null;
  if (entry.declension === '1st') return '12decl';
  if (entry.declension === '3rd') return '3decl';
  return null;
}

// ---------- VERBS ----------
// Verbs left out of passive charts because real Latin doesn't form their
// passive the regular way: intransitive verbs ("ambulor" would be "I am
// walked"), and faciō, whose present-system passive is the irregular fīō
// (not taught in Level 1). faciō's perfect passive (factus sum) is regular.
const INTRANSITIVE_VERBS = new Set([
  'ambulō', 'habitō', 'intrō', 'nāvigō', 'pugnō', 'exclāmō', 'abundō', 'errō',
  'doleō', 'iaceō', 'maneō', 'invideō', 'ārdeō', 'respondeō', 'studeō', 'sedeō', 'egeō',
  'crēdō', 'discēdō', 'cadō', 'fluō', 'currō', 'crēscō', 'vīvō', 'lūdō', 'dēscendō',
  'fugiō', 'veniō', 'conveniō', 'dormiō',
]);
const NO_PRESENT_PASSIVE = new Set(['faciō']);
// soleō, solēre, solitus sum is semi-deponent (its perfect is passive in
// form), so it's left out of the perfect-system charts.
const SEMI_DEPONENT = new Set(['soleō']);

const PERFECT_TENSES = ['perf', 'plup', 'futperf'];

// sum and possum, as tabulated in the textbook's Appendix C.
const IRREGULAR_VERBS = {
  'sum': {
    pres: ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'],
    impf: ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'],
    fut: ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erunt'],
    perf: ['fuī', 'fuistī', 'fuit', 'fuimus', 'fuistis', 'fuērunt'],
    plup: ['fueram', 'fuerās', 'fuerat', 'fuerāmus', 'fuerātis', 'fuerant'],
    futperf: ['fuerō', 'fueris', 'fuerit', 'fuerimus', 'fueritis', 'fuerint'],
  },
  'possum': {
    pres: ['possum', 'potes', 'potest', 'possumus', 'potestis', 'possunt'],
    impf: ['poteram', 'poterās', 'poterat', 'poterāmus', 'poterātis', 'poterant'],
    fut: ['poterō', 'poteris', 'poterit', 'poterimus', 'poteritis', 'poterunt'],
    perf: ['potuī', 'potuistī', 'potuit', 'potuimus', 'potuistis', 'potuērunt'],
    plup: ['potueram', 'potuerās', 'potuerat', 'potuerāmus', 'potuerātis', 'potuerant'],
    futperf: ['potuerō', 'potueris', 'potuerit', 'potuerimus', 'potueritis', 'potuerint'],
  },
};

const PRESENT_ENDINGS = {
  act: {
    '1st': ['ō', 'ās', 'at', 'āmus', 'ātis', 'ant'],
    '2nd': ['eō', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
    '3rd': ['ō', 'is', 'it', 'imus', 'itis', 'unt'],
    '3rd (-iō)': ['iō', 'is', 'it', 'imus', 'itis', 'iunt'],
    '4th': ['iō', 'īs', 'it', 'īmus', 'ītis', 'iunt'],
  },
  pass: {
    '1st': ['or', 'āris', 'ātur', 'āmur', 'āminī', 'antur'],
    '2nd': ['eor', 'ēris', 'ētur', 'ēmur', 'ēminī', 'entur'],
    '3rd': ['or', 'eris', 'itur', 'imur', 'iminī', 'untur'],
    '3rd (-iō)': ['ior', 'eris', 'itur', 'imur', 'iminī', 'iuntur'],
    '4th': ['ior', 'īris', 'ītur', 'īmur', 'īminī', 'iuntur'],
  },
};
// Imperfect: vowel before -ba-, the same for both voices (parābam, capiēbar).
const IMPERFECT_VOWEL = { '1st': 'ā', '2nd': 'ē', '3rd': 'ē', '3rd (-iō)': 'iē', '4th': 'iē' };
const IMPERFECT_ENDINGS = {
  act: ['bam', 'bās', 'bat', 'bāmus', 'bātis', 'bant'],
  pass: ['bar', 'bāris', 'bātur', 'bāmur', 'bāminī', 'bantur'],
};
// Future: -bō/-bor for 1st and 2nd conjugation; -am/-ar (with -i- for
// 3rd -iō and 4th) for the others.
const FUTURE_B = {
  act: ['bō', 'bis', 'bit', 'bimus', 'bitis', 'bunt'],
  pass: ['bor', 'beris', 'bitur', 'bimur', 'biminī', 'buntur'],
};
const FUTURE_A = {
  act: ['am', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
  pass: ['ar', 'ēris', 'ētur', 'ēmur', 'ēminī', 'entur'],
};
const PERFECT_ACTIVE_ENDINGS = {
  perf: ['ī', 'istī', 'it', 'imus', 'istis', 'ērunt'],
  plup: ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'],
  futperf: ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erint'],
};
// Tense of sum used as the auxiliary in each perfect-system passive.
const PASSIVE_AUXILIARY = { perf: 'pres', plup: 'impf', futperf: 'fut' };

const PERSON_KEYS = ['sg1', 'sg2', 'sg3', 'pl1', 'pl2', 'pl3'];

function sixForms(list) {
  return Object.fromEntries(PERSON_KEYS.map((k, i) => [k, list[i]]));
}

// Principal parts after the headword, minus construction notes such as
// "+ dative" or "(+ accusative + ablative)": ['parāre', 'parāvī', 'parātum'].
function principalParts(entry) {
  if (!entry.principal_parts) return [];
  return entry.principal_parts.replace(/\s*\(.*?\)/g, '').split(' + ')[0].split(',').map(s => s.trim());
}

function infinitiveOf(entry) {
  return principalParts(entry)[0] || null;
}

// Returns { sg1, sg2, sg3, pl1, pl2, pl3 } for the given tense and voice, or
// null if the verb has no such forms. A value is an array when several
// answers are right: perfect-system passives accept any gender of the
// participle (parātus / parāta / parātum est).
function conjugateVerb(entry, tense = 'pres', voice = 'act') {
  const irregular = IRREGULAR_VERBS[entry.latin];
  if (irregular) return voice === 'act' && irregular[tense] ? sixForms(irregular[tense]) : null;

  const [inf, perfect, supine] = principalParts(entry);
  const conj = entry.conjugation;
  if (!inf || !PRESENT_ENDINGS.act[conj]) return null; // irregular -- not charted
  const base = inf.slice(0, -3); // strip "āre" / "ēre" / "ere" / "īre"

  if (PERFECT_TENSES.includes(tense)) {
    if (voice === 'act') {
      if (!perfect || perfect === '——') return null;
      const stem = perfect.slice(0, -1); // parāvī -> parāv
      return sixForms(PERFECT_ACTIVE_ENDINGS[tense].map(e => stem + e));
    }
    if (!supine || supine === '——') return null;
    const stems = supine.split('/').map(s => s.slice(0, -2)); // parātum -> parāt (alō: altum/alitum)
    const aux = IRREGULAR_VERBS['sum'][PASSIVE_AUXILIARY[tense]];
    return sixForms(aux.map((a, i) => {
      const endings = i < 3 ? ['us', 'a', 'um'] : ['ī', 'ae', 'a'];
      return stems.flatMap(st => endings.map(e => `${st}${e} ${a}`));
    }));
  }

  let endings;
  if (tense === 'pres') endings = PRESENT_ENDINGS[voice][conj];
  else if (tense === 'impf') endings = IMPERFECT_ENDINGS[voice].map(e => IMPERFECT_VOWEL[conj] + e);
  else if (tense === 'fut' && (conj === '1st' || conj === '2nd')) {
    endings = FUTURE_B[voice].map(e => (conj === '1st' ? 'ā' : 'ē') + e);
  } else if (tense === 'fut') {
    endings = FUTURE_A[voice].map(e => (conj === '3rd' ? '' : 'i') + e);
  } else return null;
  return sixForms(endings.map(e => base + e));
}

// Whether a chart should offer this verb for the given tense and voice.
function verbHasForms(entry, tense, voice) {
  const latin = entry.latin;
  if (voice === 'pass') {
    if (INTRANSITIVE_VERBS.has(latin) || SEMI_DEPONENT.has(latin)) return false;
    if (NO_PRESENT_PASSIVE.has(latin) && !PERFECT_TENSES.includes(tense)) return false;
  }
  if (SEMI_DEPONENT.has(latin) && PERFECT_TENSES.includes(tense)) return false;
  return !!conjugateVerb(entry, tense, voice);
}

function verbCategory(entry) {
  if (entry.pos !== 'Verb') return null;
  if (['1st', '2nd', '3rd', '3rd (-iō)', '4th'].includes(entry.conjugation)) return entry.conjugation;
  return null;
}

export {
  declineNoun, nounCategory, declineAdjective, adjectiveCategory, conjugateVerb, verbCategory, verbHasForms,
  PERFECT_TENSES, PLURAL_ONLY, PLURAL_ONLY_ADJ,
};
