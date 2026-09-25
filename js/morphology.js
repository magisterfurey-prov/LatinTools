/* Latin morphology engine: generates full noun/adjective/pronoun/verb
   paradigms from the headword + genitive/principal-parts data in the
   vocabulary files. Used only to check student answers -- never shown
   directly. Where a value is an array, every listed form is accepted. */

// Nouns/adjectives whose 3rd-declension stem is an i-stem (beyond what's
// mechanically derivable). LFNM-level simplification: i-stems differ from
// regular 3rd declension only in gen. pl. -ium (masc/fem) and, for neuters,
// abl. sg. -i, nom./acc. pl. -ia, gen. pl. -ium.
const ISTEM_NOUNS_MF = new Set([
  'cīvis', 'hostis', 'urbs', 'mors', 'nox',
  'ignis', 'clādēs', 'classis', 'nāvis', 'nūbēs', 'pellis', 'axis', 'carō', 'mōns', 'pars',
  // Level 2
  'gēns', 'piscis', 'fīnis', 'vestis', 'pōns', 'mēns', 'ars', 'auris', 'orbis', 'sors', 'aedēs',
]);
const ISTEM_NOUNS_N = new Set(['mare', 'animal', 'exemplar']);

const PLURAL_ONLY = new Set(['castra', 'arma', 'dēliciae', 'tenebrae', 'dīvitiae']);

// Nouns that don't follow their declension's regular paradigm, or whose
// full paradigm is theoretical -- excluded from chart word-pickers:
// domus mixes 2nd/4th declension forms; iussus occurs only as abl. sg.
// iussū; merīdiēs has no plural in practice; adulēscēns (gen. pl.
// adulēscentium/-um) and cor (gen. pl. rare) have unsettled genitive plurals.
// Level 2: nēmō and plūs are irregular; līs (lītium) and nix (nivium) break
// the textbook's i-stem rule; turris (acc. turrim) is a pure i-stem; sēdēs
// has both sēdum and sēdium.
const IRREGULAR_NOUNS = new Set([
  'domus', 'iussus', 'merīdiēs', 'adulēscēns', 'cor',
  'nēmō', 'plūs', 'līs', 'nix', 'turris', 'sēdēs',
]);

// Cited in the plural because the singular is rarely/never used (e.g. paucī,
// paucae, pauca "few") -- excluded from chart word-pickers since a "singular"
// paradigm for these would be purely theoretical.
const PLURAL_ONLY_ADJ = new Set(['paucī, paucae, pauca', 'plūrēs, plūra']);

// 3rd declension adjectives the regular generator would decline wrongly:
// dīves, pauper, vetus, and immemor are consonant stems (abl. sg. -e,
// gen. pl. -um).
const IRREGULAR_ADJ = new Set(['dīves, dīvitis', 'pauper, pauperis', 'vetus, veteris', 'immemor, immemoris']);

// Adjectives with gen. sg. -īus and dat. sg. -ī (Level 2, Chapter 11).
const PRONOMINAL_ADJ = new Set([
  'alius, alia, aliud', 'alter, altera, alterum', 'neuter, neutra, neutrum', 'nūllus, nūlla, nūllum',
  'sōlus, sōla, sōlum', 'tōtus, tōta, tōtum', 'ūllus, ūlla, ūllum', 'ūnus, ūna, ūnum', 'uter, utra, utrum',
]);

const CASES = ['nom', 'gen', 'dat', 'acc', 'abl'];

function isNeuterGender(g) {
  return !!g && g.replace(/\./g, '').split('/').includes('n');
}

function stemFromGenitive(genitive, endingLen) {
  return genitive.slice(0, genitive.length - endingLen);
}

function headword(entry) {
  return entry.latin.split(',')[0].trim().replace(/[?!]$/, '');
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
function emptyForms() {
  return { M: { sg: {}, pl: {} }, F: { sg: {}, pl: {} }, N: { sg: {}, pl: {} } };
}

// 1st/2nd declension from a stem: bonus, bona, bonum.
function forms12(nomM, nomF, nomN, stem) {
  const forms = emptyForms();
  forms.M.sg = { nom: nomM, gen: stem + 'ī', dat: stem + 'ō', acc: stem + 'um', abl: stem + 'ō' };
  forms.M.pl = { nom: stem + 'ī', gen: stem + 'ōrum', dat: stem + 'īs', acc: stem + 'ōs', abl: stem + 'īs' };
  forms.F.sg = { nom: nomF, gen: stem + 'ae', dat: stem + 'ae', acc: stem + 'am', abl: stem + 'ā' };
  forms.F.pl = { nom: stem + 'ae', gen: stem + 'ārum', dat: stem + 'īs', acc: stem + 'ās', abl: stem + 'īs' };
  forms.N.sg = { nom: nomN, gen: stem + 'ī', dat: stem + 'ō', acc: nomN, abl: stem + 'ō' };
  forms.N.pl = { nom: stem + 'a', gen: stem + 'ōrum', dat: stem + 'īs', acc: stem + 'a', abl: stem + 'īs' };
  return forms;
}

function stem12(nomM, nomF) {
  if (nomM.endsWith('us')) return nomM.slice(0, -2);
  if (nomM.endsWith('er')) return nomF.slice(0, -1); // miser/misera, pulcher/pulchra
  return nomM.slice(0, -1); // plural-cited fallback (e.g. paucī): strip final "ī"
}

// 3rd declension i-stem pattern shared by adjectives of one, two, and three
// endings and by present participles. `ablSg` may list alternatives.
function forms3(nomM, nomF, nomN, stem, ablSg = stem + 'ī') {
  const forms = emptyForms();
  forms.M.sg = { nom: nomM, gen: stem + 'is', dat: stem + 'ī', acc: stem + 'em', abl: ablSg };
  forms.F.sg = { nom: nomF, gen: stem + 'is', dat: stem + 'ī', acc: stem + 'em', abl: ablSg };
  forms.M.pl = forms.F.pl = { nom: stem + 'ēs', gen: stem + 'ium', dat: stem + 'ibus', acc: stem + 'ēs', abl: stem + 'ibus' };
  forms.N.sg = { nom: nomN, gen: stem + 'is', dat: stem + 'ī', acc: nomN, abl: ablSg };
  forms.N.pl = { nom: stem + 'ia', gen: stem + 'ium', dat: stem + 'ibus', acc: stem + 'ia', abl: stem + 'ibus' };
  return forms;
}

// Comparatives are consonant stems: fortior, fortius, gen. fortiōris,
// abl. fortiōre, gen. pl. fortiōrum, neut. pl. fortiōra.
function declineComparative(nomMF, nomN) {
  const stem = nomMF.slice(0, -2) + 'ōr'; // fortior -> fortiōr
  const forms = emptyForms();
  forms.M.sg = forms.F.sg = { nom: nomMF, gen: stem + 'is', dat: stem + 'ī', acc: stem + 'em', abl: stem + 'e' };
  forms.M.pl = forms.F.pl = { nom: stem + 'ēs', gen: stem + 'um', dat: stem + 'ibus', acc: stem + 'ēs', abl: stem + 'ibus' };
  forms.N.sg = { nom: nomN, gen: stem + 'is', dat: stem + 'ī', acc: nomN, abl: stem + 'e' };
  forms.N.pl = { nom: stem + 'a', gen: stem + 'um', dat: stem + 'ibus', acc: stem + 'a', abl: stem + 'ibus' };
  return { type: 'comparative', forms };
}

function declineAdjective(entry) {
  const parts = entry.latin.split(',').map(s => s.trim());

  if (PRONOMINAL_ADJ.has(entry.latin)) {
    // sōlus, sōla, sōlum: gen. sg. sōlīus, dat. sg. sōlī in all genders
    // (alius: neut. aliud, gen. alīus).
    const [nomM, nomF, nomN] = parts;
    const stem = stem12(nomM, nomF);
    const forms = forms12(nomM, nomF, nomN, stem);
    const gen = nomM === 'alius' ? 'alīus' : stem + 'īus';
    for (const g of ['M', 'F', 'N']) {
      forms[g].sg.gen = gen;
      forms[g].sg.dat = stem + 'ī';
    }
    return { type: '12', forms };
  }

  if (entry.declension === 'comparative') return declineComparative(parts[0], parts[1]);

  if (entry.declension === '1st') {
    // 1st/2nd declension, 3-termination: bonus, bona, bonum (also -er: pulcher, pulchra, pulchrum)
    const [nomM, nomF, nomN] = parts;
    return { type: '12', forms: forms12(nomM, nomF, nomN, stem12(nomM, nomF)) };
  }

  // 3rd declension adjectives -- always take -ī abl. sg., -ium gen. pl., -ia neut. nom/acc pl.
  if (entry.declension === '3rd' && parts.length === 3) {
    // 3-termination: ācer, ācris, ācre
    const [nomM, nomF, nomN] = parts;
    return { type: '3-3term', forms: forms3(nomM, nomF, nomN, stemFromGenitive(nomF, 2)) };
  }

  if (entry.declension === '3rd' && parts.length === 2 && parts[0].endsWith('is')) {
    // 2-termination: fortis, forte
    const [nomMF, nomN] = parts;
    return { type: '3-2term', forms: forms3(nomMF, nomMF, nomN, stemFromGenitive(nomMF, 2)) };
  }

  if (entry.declension === '3rd' && parts.length === 2) {
    // 1-termination: fēlīx, fēlīcis (nominative all genders, then genitive singular)
    const [nomAll, gen] = parts;
    return { type: '3-1term', forms: forms3(nomAll, nomAll, nomAll, stemFromGenitive(gen, 2)) };
  }

  return null;
}

function adjectiveCategory(entry) {
  if (PRONOMINAL_ADJ.has(entry.latin)) return 'pronominal';
  if (entry.pos !== 'Adjective') return null;
  if (PLURAL_ONLY_ADJ.has(entry.latin) || IRREGULAR_ADJ.has(entry.latin)) return null;
  if (entry.declension === 'comparative') return 'comparative';
  if (entry.declension === '1st') return '12decl';
  if (entry.declension === '3rd') return '3decl';
  return null;
}

// ---------- COMPARISON OF ADJECTIVES AND ADVERBS (Level 2, Ch. 6, 8, 9, 14) ----------
// Irregular comparison (Level 2, Chapter 8, and the adverbs of Chapter 14).
const IRREGULAR_COMPARISON = {
  'bonus': { comp: ['melior', 'melius'], sup: 'optimus', adv: ['bene', 'melius', 'optimē'] },
  'malus': { comp: ['pēior', 'pēius'], sup: 'pessimus', adv: ['male', 'pēius', 'pessimē'] },
  'māgnus': { comp: ['māior', 'māius'], sup: 'maximus', adv: ['māgnopere', 'magis', 'maximē'] },
  'parvus': { comp: ['minor', 'minus'], sup: 'minimus', adv: ['parum', 'minus', 'minimē'] },
  // multus: the comparative is the neuter noun plūs (plural plūrēs, plūra).
  'multus': { comp: [['plūs', 'plūrēs'], 'plūs'], sup: 'plūrimus', adv: [['multum', 'multō'], 'plūs', 'plūrimum'] },
};
// Adjectives from the two vocabulary lists that form comparatives and
// superlatives; the rest (possessives, numbers, materials, "Roman", etc.)
// don't compare.
const COMPARABLE = new Set([
  'bonus', 'iūstus', 'māgnus', 'malus', 'praeclārus', 'longus', 'miser', 'multus', 'pulcher', 'sevērus',
  'ācer', 'celeber', 'fēlīx', 'fortis', 'crūdēlis', 'similis', 'doctus', 'difficilis', 'parvus', 'vērus',
  'ferōx', 'aequus', 'dīvīnus', 'hūmānus', 'vetustus', 'rūsticus',
  'altus', 'brevis', 'clārus', 'gravis', 'improbus', 'ingēns', 'tūtus', 'vehemēns', 'dulcis', 'levis',
  'fidēlis', 'tristis', 'ōrnātus', 'potēns', 'studiōsus', 'ūtilis', 'antīquus', 'dissimilis', 'facilis',
  'humilis', 'gracilis', 'iūcundus', 'līber', 'placidus', 'prosper', 'scelestus', 'serēnus', 'turpis', 'cārus',
]);
// The six adjectives with a superlative in -limus (Level 2, Chapter 9).
const LIMUS = new Set(['facilis', 'difficilis', 'similis', 'dissimilis', 'gracilis', 'humilis']);
// Positive adverbs the rules don't produce (Level 2, Chapter 14), and
// adjectives left out of the adverb row because their adverb is rare or
// irregular beyond what the textbook teaches.
const IRREGULAR_POSITIVE_ADVERB = { 'facilis': 'facile', 'tristis': 'triste', 'tūtus': 'tūtō' };
const NO_ADVERB = new Set(['ingēns', 'difficilis', 'gracilis', 'vetustus', 'serēnus', 'celeber']);

// The base comparatives and superlatives are built on: fortis -> fort,
// pulcher -> pulchr, fēlīx -> fēlīc, ingēns -> ingent.
function comparisonBase(entry) {
  const parts = entry.latin.split(',').map(s => s.trim());
  if (entry.declension === '1st') return stem12(parts[0], parts[1]);
  if (parts.length === 3) return stemFromGenitive(parts[1], 2); // ācer, ācris
  if (parts[0].endsWith('is')) return stemFromGenitive(parts[0], 2); // fortis
  return stemFromGenitive(parts[1], 2); // fēlīx, fēlīcis
}

// { positive, comparative: [m/f, n], superlative, adverbs: [pos, comp, sup] | null }
function comparisonOf(entry) {
  if (entry.pos !== 'Adjective') return null;
  const head = headword(entry);
  if (!COMPARABLE.has(head)) return null;
  const irregular = IRREGULAR_COMPARISON[head];
  if (irregular) {
    return { positive: head, comparative: irregular.comp, superlative: irregular.sup, adverbs: irregular.adv };
  }
  const base = comparisonBase(entry);
  const comparative = [base + 'ior', base + 'ius'];
  let superlative;
  if (head.endsWith('er')) superlative = head + 'rimus'; // pulcherrimus, ācerrimus, līberrimus
  else if (LIMUS.has(head)) superlative = base + 'limus'; // facillimus
  else superlative = base + 'issimus';
  let adverbs = null;
  if (!NO_ADVERB.has(head)) {
    let positive = IRREGULAR_POSITIVE_ADVERB[head];
    if (!positive) {
      if (entry.declension === '1st') positive = base + 'ē'; // iūstē, pulchrē
      else if (base.endsWith('nt')) positive = base + 'er'; // vehementer, potenter
      else positive = base + 'iter'; // fortiter, ācriter, fēlīciter
    }
    adverbs = [positive, base + 'ius', superlative.slice(0, -2) + 'ē'];
  }
  return { positive: head, comparative, superlative, adverbs };
}

// ---------- PRONOUNS ----------
// Tables from the textbook's appendix (Level 1 Appendix C / Level 2 Appendix B).
function pronounTable(rows) {
  const forms = emptyForms();
  CASES.forEach((c, i) => {
    const [mS, fS, nS, mP, fP, nP] = rows[i].map(v => (v.includes('/') ? v.split('/') : v));
    forms.M.sg[c] = mS; forms.F.sg[c] = fS; forms.N.sg[c] = nS;
    forms.M.pl[c] = mP; forms.F.pl[c] = fP; forms.N.pl[c] = nP;
  });
  return forms;
}

const PRONOUN_TABLES = {
  'is': [['is', 'ea', 'id', 'eī/iī', 'eae', 'ea'], ['ēius', 'ēius', 'ēius', 'eōrum', 'eārum', 'eōrum'],
    ['eī', 'eī', 'eī', 'eīs/iīs', 'eīs/iīs', 'eīs/iīs'], ['eum', 'eam', 'id', 'eōs', 'eās', 'ea'],
    ['eō', 'eā', 'eō', 'eīs/iīs', 'eīs/iīs', 'eīs/iīs']],
  'hic': [['hic', 'haec', 'hoc', 'hī', 'hae', 'haec'], ['hūius', 'hūius', 'hūius', 'hōrum', 'hārum', 'hōrum'],
    ['huic', 'huic', 'huic', 'hīs', 'hīs', 'hīs'], ['hunc', 'hanc', 'hoc', 'hōs', 'hās', 'haec'],
    ['hōc', 'hāc', 'hōc', 'hīs', 'hīs', 'hīs']],
  'ille': [['ille', 'illa', 'illud', 'illī', 'illae', 'illa'], ['illīus', 'illīus', 'illīus', 'illōrum', 'illārum', 'illōrum'],
    ['illī', 'illī', 'illī', 'illīs', 'illīs', 'illīs'], ['illum', 'illam', 'illud', 'illōs', 'illās', 'illa'],
    ['illō', 'illā', 'illō', 'illīs', 'illīs', 'illīs']],
  'iste': [['iste', 'ista', 'istud', 'istī', 'istae', 'ista'], ['istīus', 'istīus', 'istīus', 'istōrum', 'istārum', 'istōrum'],
    ['istī', 'istī', 'istī', 'istīs', 'istīs', 'istīs'], ['istum', 'istam', 'istud', 'istōs', 'istās', 'ista'],
    ['istō', 'istā', 'istō', 'istīs', 'istīs', 'istīs']],
  'īdem': [['īdem', 'eadem', 'idem', 'eīdem', 'eaedem', 'eadem'], ['ēiusdem', 'ēiusdem', 'ēiusdem', 'eōrundem', 'eārundem', 'eōrundem'],
    ['eīdem', 'eīdem', 'eīdem', 'eīsdem', 'eīsdem', 'eīsdem'], ['eundem', 'eandem', 'idem', 'eōsdem', 'eāsdem', 'eadem'],
    ['eōdem', 'eādem', 'eōdem', 'eīsdem', 'eīsdem', 'eīsdem']],
  'ipse': [['ipse', 'ipsa', 'ipsum', 'ipsī', 'ipsae', 'ipsa'], ['ipsīus', 'ipsīus', 'ipsīus', 'ipsōrum', 'ipsārum', 'ipsōrum'],
    ['ipsī', 'ipsī', 'ipsī', 'ipsīs', 'ipsīs', 'ipsīs'], ['ipsum', 'ipsam', 'ipsum', 'ipsōs', 'ipsās', 'ipsa'],
    ['ipsō', 'ipsā', 'ipsō', 'ipsīs', 'ipsīs', 'ipsīs']],
  'quī': [['quī', 'quae', 'quod', 'quī', 'quae', 'quae'], ['cūius', 'cūius', 'cūius', 'quōrum', 'quārum', 'quōrum'],
    ['cui', 'cui', 'cui', 'quibus', 'quibus', 'quibus'], ['quem', 'quam', 'quod', 'quōs', 'quās', 'quae'],
    ['quō', 'quā', 'quō', 'quibus', 'quibus', 'quibus']],
};

function pronounCategory(entry) {
  if (entry.pos !== 'Pronoun') return null;
  return PRONOUN_TABLES[headword(entry)] ? 'demonstrative' : null;
}

function declinePronoun(entry) {
  const rows = PRONOUN_TABLES[headword(entry)];
  return rows ? { type: '12', forms: pronounTable(rows) } : null;
}

// ---------- VERBS ----------
// Verbs left out of passive charts because real Latin doesn't form their
// passive the regular way: intransitive verbs ("ambulor" would be "I am
// walked"), and faciō, whose present-system passive is the irregular fīō.
// faciō's perfect passive (factus sum) is regular.
const INTRANSITIVE_VERBS = new Set([
  'ambulō', 'habitō', 'intrō', 'nāvigō', 'pugnō', 'exclāmō', 'abundō', 'errō',
  'doleō', 'iaceō', 'maneō', 'invideō', 'ārdeō', 'respondeō', 'studeō', 'sedeō', 'egeō',
  'crēdō', 'discēdō', 'cadō', 'fluō', 'currō', 'crēscō', 'vīvō', 'lūdō', 'dēscendō',
  'fugiō', 'veniō', 'conveniō', 'dormiō',
  // Level 2
  'valeō', 'furō', 'invādō', 'parcō', 'resistō', 'placeō', 'perveniō', 'taceō', 'appropinquō',
  'clāmō', 'rīdeō',
]);
const NO_PRESENT_PASSIVE = new Set(['faciō']);
// soleō, solēre, solitus sum is semi-deponent (its perfect is passive in
// form), so it's left out of the perfect-system charts.
const SEMI_DEPONENT = new Set(['soleō']);

const PERFECT_TENSES = ['perf', 'plup', 'futperf'];
// Subjunctive has no future or future perfect.
const SUBJUNCTIVE_TENSES = ['pres', 'impf', 'perf', 'plup'];

function list(s) {
  return s.split(' ').map(f => (f.includes('/') ? f.split('/') : f));
}

// Irregular verbs, from the textbooks' appendix tables. The perfect system of
// eō also accepts the shorter forms (iī, īstī, ...) the vocabulary lists.
const IRREGULAR_VERBS = {
  'sum': {
    ind: {
      pres: list('sum es est sumus estis sunt'), impf: list('eram erās erat erāmus erātis erant'),
      fut: list('erō eris erit erimus eritis erunt'), perf: list('fuī fuistī fuit fuimus fuistis fuērunt'),
      plup: list('fueram fuerās fuerat fuerāmus fuerātis fuerant'), futperf: list('fuerō fueris fuerit fuerimus fueritis fuerint'),
    },
    subj: {
      pres: list('sim sīs sit sīmus sītis sint'), impf: list('essem essēs esset essēmus essētis essent'),
      perf: list('fuerim fueris fuerit fuerimus fueritis fuerint'), plup: list('fuissem fuissēs fuisset fuissēmus fuissētis fuissent'),
    },
  },
  'possum': {
    ind: {
      pres: list('possum potes potest possumus potestis possunt'), impf: list('poteram poterās poterat poterāmus poterātis poterant'),
      fut: list('poterō poteris poterit poterimus poteritis poterunt'), perf: list('potuī potuistī potuit potuimus potuistis potuērunt'),
      plup: list('potueram potuerās potuerat potuerāmus potuerātis potuerant'),
      futperf: list('potuerō potueris potuerit potuerimus potueritis potuerint'),
    },
    subj: {
      pres: list('possim possīs possit possīmus possītis possint'), impf: list('possem possēs posset possēmus possētis possent'),
      perf: list('potuerim potueris potuerit potuerimus potueritis potuerint'),
      plup: list('potuissem potuissēs potuisset potuissēmus potuissētis potuissent'),
    },
  },
  'volō': {
    ind: {
      pres: list('volō vīs vult volumus vultis volunt'), impf: list('volēbam volēbās volēbat volēbāmus volēbātis volēbant'),
      fut: list('volam volēs volet volēmus volētis volent'), perf: list('voluī voluistī voluit voluimus voluistis voluērunt'),
      plup: list('volueram voluerās voluerat voluerāmus voluerātis voluerant'),
      futperf: list('voluerō volueris voluerit voluerimus volueritis voluerint'),
    },
    subj: {
      pres: list('velim velīs velit velīmus velītis velint'), impf: list('vellem vellēs vellet vellēmus vellētis vellent'),
      perf: list('voluerim volueris voluerit voluerimus volueritis voluerint'),
      plup: list('voluissem voluissēs voluisset voluissēmus voluissētis voluissent'),
    },
  },
  'nōlō': {
    ind: {
      pres: ['nōlō', 'nōn vīs', 'nōn vult', 'nōlumus', 'nōn vultis', 'nōlunt'],
      impf: list('nōlēbam nōlēbās nōlēbat nōlēbāmus nōlēbātis nōlēbant'), fut: list('nōlam nōlēs nōlet nōlēmus nōlētis nōlent'),
      perf: list('nōluī nōluistī nōluit nōluimus nōluistis nōluērunt'),
      plup: list('nōlueram nōluerās nōluerat nōluerāmus nōluerātis nōluerant'),
      futperf: list('nōluerō nōlueris nōluerit nōluerimus nōlueritis nōluerint'),
    },
    subj: {
      pres: list('nōlim nōlīs nōlit nōlīmus nōlītis nōlint'), impf: list('nōllem nōllēs nōllet nōllēmus nōllētis nōllent'),
      perf: list('nōluerim nōlueris nōluerit nōluerimus nōlueritis nōluerint'),
      plup: list('nōluissem nōluissēs nōluisset nōluissēmus nōluissētis nōluissent'),
    },
  },
  'mālō': {
    ind: {
      pres: list('mālō māvīs māvult mālumus māvultis mālunt'), impf: list('mālēbam mālēbās mālēbat mālēbāmus mālēbātis mālēbant'),
      fut: list('mālam mālēs mālet mālēmus mālētis mālent'), perf: list('māluī māluistī māluit māluimus māluistis māluērunt'),
      plup: list('mālueram māluerās māluerat māluerāmus māluerātis māluerant'),
      futperf: list('māluerō mālueris māluerit māluerimus mālueritis māluerint'),
    },
    subj: {
      pres: list('mālim mālīs mālit mālīmus mālītis mālint'), impf: list('māllem māllēs māllet māllēmus māllētis māllent'),
      perf: list('māluerim mālueris māluerit māluerimus mālueritis māluerint'),
      plup: list('māluissem māluissēs māluisset māluissēmus māluissētis māluissent'),
    },
  },
  'eō': {
    ind: {
      pres: list('eō īs it īmus ītis eunt'), impf: list('ībam ībās ībat ībāmus ībātis ībant'),
      fut: list('ībō ībis ībit ībimus ībitis ībunt'),
      perf: list('īvī/iī īvistī/īstī/iistī īvit/iit īvimus/iimus īvistis/īstis/iistis īvērunt/iērunt'),
      plup: list('īveram/ieram īverās/ierās īverat/ierat īverāmus/ierāmus īverātis/ierātis īverant/ierant'),
      futperf: list('īverō/ierō īveris/ieris īverit/ierit īverimus/ierimus īveritis/ieritis īverint/ierint'),
    },
    subj: {
      pres: list('eam eās eat eāmus eātis eant'), impf: list('īrem īrēs īret īrēmus īrētis īrent'),
      perf: list('īverim/ierim īveris/ieris īverit/ierit īverimus/ierimus īveritis/ieritis īverint/ierint'),
      plup: list('īvissem/īssem īvissēs/īssēs īvisset/īsset īvissēmus/īssēmus īvissētis/īssētis īvissent/īssent'),
    },
  },
  'ferō': {
    ind: {
      pres: list('ferō fers fert ferimus fertis ferunt'), impf: list('ferēbam ferēbās ferēbat ferēbāmus ferēbātis ferēbant'),
      fut: list('feram ferēs feret ferēmus ferētis ferent'), perf: list('tulī tulistī tulit tulimus tulistis tulērunt'),
      plup: list('tuleram tulerās tulerat tulerāmus tulerātis tulerant'), futperf: list('tulerō tuleris tulerit tulerimus tuleritis tulerint'),
    },
    subj: {
      pres: list('feram ferās ferat ferāmus ferātis ferant'), impf: list('ferrem ferrēs ferret ferrēmus ferrētis ferrent'),
      perf: list('tulerim tuleris tulerit tulerimus tuleritis tulerint'), plup: list('tulissem tulissēs tulisset tulissēmus tulissētis tulissent'),
    },
    passive: {
      ind: {
        pres: list('feror ferris fertur ferimur feriminī feruntur'),
        impf: list('ferēbar ferēbāris ferēbātur ferēbāmur ferēbāminī ferēbantur'),
        fut: list('ferar ferēris ferētur ferēmur ferēminī ferentur'),
      },
      subj: {
        pres: list('ferar ferāris ferātur ferāmur ferāminī ferantur'),
        impf: list('ferrer ferrēris ferrētur ferrēmur ferrēminī ferrentur'),
      },
    },
  },
  'fīō': {
    ind: {
      pres: list('fīō fīs fit fīmus fītis fīunt'), impf: list('fīēbam fīēbās fīēbat fīēbāmus fīēbātis fīēbant'),
      fut: list('fīam fīēs fīet fīēmus fīētis fīent'),
    },
    subj: { pres: list('fīam fīās fiat fīāmus fīātis fīant'), impf: list('fierem fierēs fieret fierēmus fierētis fierent') },
  },
};
// Compounds conjugated as a prefix plus the simple verb (Level 2 vocabulary).
// Their perfect system comes from their own principal parts (āfuī, rettulī,
// relātum), except compounds of eō, which also accept rediī-type forms.
const COMPOUND_VERBS = {
  'absum': { base: 'sum', prefix: 'ab' },
  'redeō': { base: 'eō', prefix: 'red' },
  'circumeō': { base: 'eō', prefix: 'circum' },
  'referō': { base: 'ferō', prefix: 're' },
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
// Present subjunctive (Level 2, Ch. 1-2): parem, teneam, petam, audiam, capiam.
const PRESENT_SUBJUNCTIVE_VOWEL = { '1st': 'e', '2nd': 'ea', '3rd': 'a', '3rd (-iō)': 'ia', '4th': 'ia' };
const SUBJUNCTIVE_ENDINGS = {
  act: ['m', 's', 't', 'mus', 'tis', 'nt'],
  pass: ['r', 'ris', 'tur', 'mur', 'minī', 'ntur'],
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
  ind: {
    perf: ['ī', 'istī', 'it', 'imus', 'istis', 'ērunt'],
    plup: ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'],
    futperf: ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erint'],
  },
  subj: {
    perf: ['erim', 'eris', 'erit', 'erimus', 'eritis', 'erint'],
    plup: ['issem', 'issēs', 'isset', 'issēmus', 'issētis', 'issent'],
  },
};
// Tense and mood of sum used as the auxiliary in each perfect-system passive.
const PASSIVE_AUXILIARY = {
  ind: { perf: 'pres', plup: 'impf', futperf: 'fut' },
  subj: { perf: 'pres', plup: 'impf' },
};
// Infinitive endings of deponents (hortārī, verērī, sequī, partīrī, patī) and
// the "active" infinitive their imperfect subjunctive is built on (hortārer).
const DEPONENT_INFINITIVE = { '1st': 'ārī', '2nd': 'ērī', '3rd': 'ī', '3rd (-iō)': 'ī', '4th': 'īrī' };
const ACTIVE_INFINITIVE = { '1st': 'āre', '2nd': 'ēre', '3rd': 'ere', '3rd (-iō)': 'ere', '4th': 'īre' };

const PERSON_KEYS = ['sg1', 'sg2', 'sg3', 'pl1', 'pl2', 'pl3'];

function sixForms(forms) {
  return Object.fromEntries(PERSON_KEYS.map((k, i) => [k, forms[i]]));
}

function withPrefix(prefix, form) {
  return Array.isArray(form) ? form.map(f => withPrefix(prefix, f)) : prefix + form;
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

// Perfect passive participle + a form of sum (any gender of the participle).
function participlePlusSum(stems, aux) {
  return sixForms(aux.map((a, i) => {
    const endings = i < 3 ? ['us', 'a', 'um'] : ['ī', 'ae', 'a'];
    return stems.flatMap(st => endings.map(e => `${st}${e} ${a}`));
  }));
}

function sumForms(mood, tense) {
  return IRREGULAR_VERBS['sum'][mood][tense];
}

// Present-system forms of a regular stem ("present" / "imperfect" /
// "future", indicative or subjunctive) with the given voice's endings.
function presentSystem(base, conj, tense, voice, mood, activeInfinitive) {
  let endings;
  if (mood === 'subj') {
    if (tense === 'pres') endings = SUBJUNCTIVE_ENDINGS[voice].map(e => PRESENT_SUBJUNCTIVE_VOWEL[conj] + e);
    else if (tense === 'impf') {
      // imperfect subjunctive = present active infinitive + endings (parārem, parārer)
      const stem = activeInfinitive.slice(0, -1); // parāre -> parār
      endings = SUBJUNCTIVE_ENDINGS[voice].map(e => 'e' + e);
      return lengthenSubjunctive(endings.map(e => stem + e), voice);
    } else return null;
  } else if (tense === 'pres') endings = PRESENT_ENDINGS[voice][conj];
  else if (tense === 'impf') endings = IMPERFECT_ENDINGS[voice].map(e => IMPERFECT_VOWEL[conj] + e);
  else if (tense === 'fut' && (conj === '1st' || conj === '2nd')) {
    endings = FUTURE_B[voice].map(e => (conj === '1st' ? 'ā' : 'ē') + e);
  } else if (tense === 'fut') {
    endings = FUTURE_A[voice].map(e => (conj === '3rd' ? '' : 'i') + e);
  } else return null;
  const forms = endings.map(e => base + e);
  return mood === 'subj' ? lengthenSubjunctive(forms, voice) : forms;
}

// Vowel lengths in the subjunctive endings, as in the textbook tables:
// parēs / parēmus / parēris (long before -s, -mus, -tis, -ris, -mur, -minī)
// but paret, parent, parer, parentur (short before -t, -nt, -r, -ntur).
function lengthenSubjunctive(forms, voice) {
  const LONG = { e: 'ē', a: 'ā' };
  const longBefore = voice === 'act' ? [1, 3, 4] : [1, 2, 3, 4];
  return forms.map((f, i) => {
    if (!longBefore.includes(i)) return f;
    const ending = voice === 'act' ? ['m', 's', 't', 'mus', 'tis', 'nt'][i] : ['r', 'ris', 'tur', 'mur', 'minī', 'ntur'][i];
    const cut = f.length - ending.length - 1;
    const v = f[cut];
    return LONG[v] ? f.slice(0, cut) + LONG[v] + f.slice(cut + 1) : f;
  });
}

// Returns { sg1, sg2, sg3, pl1, pl2, pl3 } for the given tense, voice, and
// mood ('ind' or 'subj'), or null if the verb has no such forms. Deponents
// ignore `voice`: their forms are always passive in form.
function conjugateVerb(entry, tense = 'pres', voice = 'act', mood = 'ind') {
  if (mood === 'subj' && !SUBJUNCTIVE_TENSES.includes(tense)) return null;
  const latin = entry.latin;

  const compound = COMPOUND_VERBS[latin];
  const irregular = IRREGULAR_VERBS[latin] || (compound && IRREGULAR_VERBS[compound.base]);
  if (irregular) {
    const prefix = compound ? compound.prefix : '';
    const [, perfect, supine] = principalParts(entry);
    if (voice === 'pass') {
      if (!irregular.passive) return null;
      if (PERFECT_TENSES.includes(tense)) {
        const aux = PASSIVE_AUXILIARY[mood][tense];
        return aux ? participlePlusSum([supine.slice(0, -2)], sumForms(mood, aux)) : null;
      }
      const table = irregular.passive[mood] && irregular.passive[mood][tense];
      return table ? sixForms(table.map(f => withPrefix(prefix, f))) : null;
    }
    if (latin === 'fīō' && PERFECT_TENSES.includes(tense)) {
      const aux = PASSIVE_AUXILIARY[mood][tense];
      return aux ? participlePlusSum(['fact'], sumForms(mood, aux)) : null;
    }
    // Compounds other than eō's take their perfect system from their own
    // principal parts (āfuī, rettulī).
    if (compound && compound.base !== 'eō' && PERFECT_TENSES.includes(tense)) {
      const endings = PERFECT_ACTIVE_ENDINGS[mood][tense];
      return endings ? sixForms(endings.map(e => perfect.slice(0, -1) + e)) : null;
    }
    const table = irregular[mood] && irregular[mood][tense];
    return table ? sixForms(table.map(f => withPrefix(prefix, f))) : null;
  }

  const [inf, perfect, supine] = principalParts(entry);
  const conj = entry.conjugation;
  if (!inf || !PRESENT_ENDINGS.act[conj]) return null; // irregular or defective -- not charted

  if (entry.deponent) {
    // hortor, hortārī, hortātus sum: passive forms throughout
    const base = inf.slice(0, -DEPONENT_INFINITIVE[conj].length);
    if (PERFECT_TENSES.includes(tense)) {
      const aux = PASSIVE_AUXILIARY[mood][tense];
      const stem = perfect.replace(/us sum$/, ''); // hortātus sum -> hortāt
      return aux ? participlePlusSum([stem], sumForms(mood, aux)) : null;
    }
    const forms = presentSystem(base, conj, tense, 'pass', mood, base + ACTIVE_INFINITIVE[conj]);
    return forms ? sixForms(forms) : null;
  }

  const base = inf.slice(0, -3); // strip "āre" / "ēre" / "ere" / "īre"
  if (PERFECT_TENSES.includes(tense)) {
    if (voice === 'act') {
      if (!perfect || perfect === '——') return null;
      const stem = perfect.slice(0, -1); // parāvī -> parāv
      const endings = PERFECT_ACTIVE_ENDINGS[mood][tense];
      return endings ? sixForms(endings.map(e => stem + e)) : null;
    }
    if (!supine || supine === '——') return null;
    const stems = supine.split('/').map(s => s.slice(0, -2)); // parātum -> parāt (alō: altum/alitum)
    const aux = PASSIVE_AUXILIARY[mood][tense];
    return aux ? participlePlusSum(stems, sumForms(mood, aux)) : null;
  }
  const forms = presentSystem(base, conj, tense, voice, mood, inf);
  return forms ? sixForms(forms) : null;
}

// Whether a chart should offer this verb for the given tense, voice, and mood.
function verbHasForms(entry, tense, voice, mood = 'ind') {
  const latin = entry.latin;
  if (voice === 'pass' && !entry.deponent) {
    if (INTRANSITIVE_VERBS.has(latin) || SEMI_DEPONENT.has(latin)) return false;
    if (NO_PRESENT_PASSIVE.has(latin) && !PERFECT_TENSES.includes(tense)) return false;
  }
  if (SEMI_DEPONENT.has(latin) && PERFECT_TENSES.includes(tense)) return false;
  return !!conjugateVerb(entry, tense, voice, mood);
}

function verbCategory(entry) {
  if (entry.pos !== 'Verb') return null;
  if (entry.deponent) return 'deponent';
  if (['1st', '2nd', '3rd', '3rd (-iō)', '4th'].includes(entry.conjugation)) return entry.conjugation;
  return null;
}

// Irregular verbs charted in the "Irregular Verbs" chart.
function isIrregularVerb(entry) {
  return entry.pos === 'Verb' && !!(IRREGULAR_VERBS[entry.latin] || COMPOUND_VERBS[entry.latin]);
}

// ---------- PARTICIPLES AND GERUNDS (Level 2, Ch. 11 and 15) ----------
// Present active participles of the irregular verbs (textbook, Ch. 11);
// sum, fīō, and mālō have none.
const IRREGULAR_PARTICIPLES = {
  'eō': ['iēns', 'euntis'], 'ferō': ['ferēns', 'ferentis'], 'nōlō': ['nōlēns', 'nōlentis'],
  'volō': ['volēns', 'volentis'], 'possum': ['potēns', 'potentis'],
};
const IRREGULAR_GERUNDS = { 'eō': 'eund', 'ferō': 'ferend' };

// Present stem the participle and gerund are built on, and the vowel that
// precedes -ns / -nd: parā-, tenē-, pete-, capie-, audie-.
function presentStem(entry) {
  const [inf] = principalParts(entry);
  const conj = entry.conjugation;
  if (!inf || !PRESENT_ENDINGS.act[conj]) return null;
  const base = entry.deponent ? inf.slice(0, -DEPONENT_INFINITIVE[conj].length) : inf.slice(0, -3);
  return { base, conj };
}

// ['parāns', 'parantis'] or null.
function presentParticiple(entry) {
  const compound = COMPOUND_VERBS[entry.latin];
  const irregular = IRREGULAR_PARTICIPLES[entry.latin] || (compound && IRREGULAR_PARTICIPLES[compound.base]);
  if (irregular) return compound ? irregular.map(f => compound.prefix + f) : irregular;
  if (compound || IRREGULAR_VERBS[entry.latin]) return null;
  const stem = presentStem(entry);
  if (!stem) return null;
  const { base, conj } = stem;
  if (conj === '1st') return [base + 'āns', base + 'antis'];
  if (conj === '2nd' || conj === '3rd') return [base + 'ēns', base + 'entis'];
  return [base + 'iēns', base + 'ientis']; // 4th and 3rd -iō
}

// Declined like a 3rd declension adjective of one ending; the ablative
// singular is -ī in the textbook's table and -e in ablative absolutes, so
// both are accepted.
function declineParticiple(entry) {
  const p = presentParticiple(entry);
  if (!p) return null;
  const [nom, gen] = p;
  const stem = gen.slice(0, -2);
  return { type: '3-1term', forms: forms3(nom, nom, nom, stem, [stem + 'ī', stem + 'e']) };
}

// { gen, dat, acc, abl } of the gerund, or null.
function gerundOf(entry) {
  const compound = COMPOUND_VERBS[entry.latin];
  let stem = IRREGULAR_GERUNDS[entry.latin] || (compound && IRREGULAR_GERUNDS[compound.base] && compound.prefix + IRREGULAR_GERUNDS[compound.base]);
  if (!stem) {
    if (compound || IRREGULAR_VERBS[entry.latin]) return null;
    const s = presentStem(entry);
    if (!s) return null;
    stem = s.base + { '1st': 'and', '2nd': 'end', '3rd': 'end', '3rd (-iō)': 'iend', '4th': 'iend' }[s.conj];
  }
  return { gen: stem + 'ī', dat: stem + 'ō', acc: stem + 'um', abl: stem + 'ō' };
}

export {
  declineNoun, nounCategory, declineAdjective, adjectiveCategory, declineComparative, comparisonOf,
  pronounCategory, declinePronoun, conjugateVerb, verbCategory, verbHasForms, isIrregularVerb,
  presentParticiple, declineParticiple, gerundOf,
  PERFECT_TENSES, SUBJUNCTIVE_TENSES, PLURAL_ONLY, PLURAL_ONLY_ADJ,
};
