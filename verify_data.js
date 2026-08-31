// One-off data-integrity check (not part of the site). Run with: node verify_data.js
const fs = require("fs");
const vm = require("vm");

function loadDataFile(path) {
  const code = fs.readFileSync(path, "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: path });
  return sandbox.window;
}

let errors = [];
function fail(msg) { errors.push(msg); }

// ---------- vocabulary.js ----------
{
  const w = loadDataFile("data/vocabulary.js");
  const data = w.VOCAB_DATA;
  if (!Array.isArray(data) || !data.length) fail("VOCAB_DATA missing or empty");
  const ids = new Set();
  data.forEach((entry, i) => {
    ["id", "latin", "english", "pos", "chapter"].forEach((key) => {
      if (!entry[key] || typeof entry[key] !== "string") fail(`vocabulary[${i}] (${entry.id}) missing/invalid "${key}"`);
    });
    if (ids.has(entry.id)) fail(`vocabulary duplicate id: ${entry.id}`);
    ids.add(entry.id);
  });
  console.log(`vocabulary.js: ${data.length} entries checked`);
}

// ---------- grammarCharts.js ----------
{
  const w = loadDataFile("data/grammarCharts.js");
  const charts = w.GRAMMAR_CHARTS;
  const allIds = new Set();
  ["nouns", "verbs"].forEach((cat) => {
    (charts[cat] || []).forEach((chart) => {
      if (allIds.has(chart.id)) fail(`grammarCharts duplicate id: ${chart.id}`);
      allIds.add(chart.id);
      const nCols = chart.colsHeader.length;
      chart.rows.forEach((row, ri) => {
        if (row.answers.length !== nCols) fail(`${chart.id} row ${ri} ("${row.label}") has ${row.answers.length} answers, expected ${nCols}`);
        row.answers.forEach((a, ci) => { if (!a || !a.trim()) fail(`${chart.id} row ${ri} col ${ci} is empty`); });
      });
    });
  });
  (charts.adjectives || []).forEach((chart) => {
    if (allIds.has(chart.id)) fail(`grammarCharts duplicate id: ${chart.id}`);
    allIds.add(chart.id);
    chart.blocks.forEach((block, bi) => {
      const nCols = block.colsHeader.length;
      block.rows.forEach((row, ri) => {
        if (row.answers.length !== nCols) fail(`${chart.id} block ${bi} ("${block.label}") row ${ri} has ${row.answers.length} answers, expected ${nCols}`);
        row.answers.forEach((a, ci) => { if (!a || !a.trim()) fail(`${chart.id} block ${bi} row ${ri} col ${ci} is empty`); });
      });
    });
  });
  const total = (charts.nouns||[]).length + (charts.verbs||[]).length + (charts.adjectives||[]).length;
  console.log(`grammarCharts.js: ${total} chart entries checked (${allIds.size} unique ids)`);
}

// ---------- sentences.js ----------
{
  const w = loadDataFile("data/sentences.js");
  const sentences = w.SENTENCE_DATA;
  const fieldDefs = w.PARSE_FIELD_DEFS;
  const usageOptions = new Set(w.USAGE_OPTIONS);
  if (!Array.isArray(sentences) || !sentences.length) fail("SENTENCE_DATA missing or empty");

  sentences.forEach((s) => {
    if (!s.latin) fail(`sentence ${s.id} missing latin text`);
    if (!Array.isArray(s.acceptableTranslations) || !s.acceptableTranslations.length) fail(`sentence ${s.id} missing acceptableTranslations`);
    // every word in s.latin that has a parse entry should literally appear in the latin string
    (s.words || []).forEach((word) => {
      if (!s.latin.includes(word.text)) fail(`sentence ${s.id}: word "${word.text}" not found verbatim in latin text "${s.latin}"`);
      const defs = fieldDefs[word.pos];
      if (!defs) { fail(`sentence ${s.id}: unknown pos "${word.pos}" for word "${word.text}"`); return; }
      defs.forEach((def) => {
        const val = word.parse ? word.parse[def.key] : undefined;
        if (val === undefined) fail(`sentence ${s.id} word "${word.text}" missing parse field "${def.key}"`);
        else if (!def.options.includes(val)) fail(`sentence ${s.id} word "${word.text}" field "${def.key}" value "${val}" not in allowed options [${def.options.join(", ")}]`);
      });
      if (word.usage && !usageOptions.has(word.usage)) fail(`sentence ${s.id} word "${word.text}" usage "${word.usage}" not in USAGE_OPTIONS`);
    });
  });
  console.log(`sentences.js: ${sentences.length} sentences checked`);
}

if (errors.length) {
  console.log("\nFAILURES:");
  errors.forEach((e) => console.log(" - " + e));
  process.exit(1);
} else {
  console.log("\nAll data integrity checks passed.");
}
