/* Latin morphology engine: generates full noun/adjective/verb paradigms
   from the headword + genitive/principal-parts data already in vocabulary.js.
   Used only to check student answers -- never shown directly. */

// Nouns/adjectives whose 3rd-declension stem is an i-stem (beyond what's
// mechanically derivable). LFNM-level simplification: i-stems differ from
// regular 3rd declension only in gen. pl. -ium (masc/fem) and, for neuters,
// abl. sg. -i, nom./acc. pl. -ia, gen. pl. -ium.
const ISTEM_NOUNS_MF = new Set(['cīvis', 'hostis', 'urbs', 'mors', 'nox']);
const ISTEM_NOUNS_N = new Set(['mare', 'animal', 'exemplar']);

const PLURAL_ONLY = new Set(['castra', 'arma', 'dēliciae', 'tenebrae']);

// Cited in the plural because the singular is rarely/never used (e.g. paucī,
// paucae, pauca "few") -- excluded from chart word-pickers since a "singular"
// paradigm for these would be purely theoretical.
const PLURAL_ONLY_ADJ = new Set(['paucī, paucae, pauca']);

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

  return null;
}

function nounCategory(entry) {
  if (PLURAL_ONLY.has(entry.latin)) return null;
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
  if (PLURAL_ONLY_ADJ.has(entry.latin)) return null;
  if (entry.declension === '1st') return '12decl';
  if (entry.declension === '3rd') return '3decl';
  return null;
}

// ---------- VERBS ----------
function infinitiveOf(entry) {
  if (!entry.principal_parts) return null;
  return entry.principal_parts.split(',')[0].trim();
}

function conjugateVerb(entry) {
  const inf = infinitiveOf(entry);
  if (!inf) return null;
  const conj = entry.conjugation;
  let base, endings;

  if (conj === '1st') {
    base = inf.slice(0, -3); // strip "āre"
    endings = ['ō', 'ās', 'at', 'āmus', 'ātis', 'ant'];
  } else if (conj === '2nd') {
    base = inf.slice(0, -3); // strip "ēre"
    endings = ['eō', 'ēs', 'et', 'ēmus', 'ētis', 'ent'];
  } else if (conj === '3rd') {
    base = inf.slice(0, -3); // strip "ere"
    endings = ['ō', 'is', 'it', 'imus', 'itis', 'unt'];
  } else if (conj === '3rd (-iō)') {
    base = inf.slice(0, -3); // strip "ere"
    endings = ['iō', 'is', 'it', 'imus', 'itis', 'iunt'];
  } else if (conj === '4th') {
    base = inf.slice(0, -3); // strip "īre"
    endings = ['iō', 'īs', 'it', 'īmus', 'ītis', 'iunt'];
  } else {
    return null; // irregular (sum, possum) -- not used in regular conjugation charts
  }

  return {
    sg1: base + endings[0], sg2: base + endings[1], sg3: base + endings[2],
    pl1: base + endings[3], pl2: base + endings[4], pl3: base + endings[5],
  };
}

function verbCategory(entry) {
  if (entry.pos !== 'Verb') return null;
  if (['1st', '2nd', '3rd', '3rd (-iō)', '4th'].includes(entry.conjugation)) return entry.conjugation;
  return null;
}

export { declineNoun, nounCategory, declineAdjective, adjectiveCategory, conjugateVerb, verbCategory, PLURAL_ONLY, PLURAL_ONLY_ADJ };
