/* ==========================================================================
   Vocabulary import helper logic (vocab-import.html).
   Parses pasted text client-side and generates JS object literals formatted
   to match data/vocabulary.js. Nothing here touches a server or a file on
   disk — it only produces text for the teacher to copy/paste by hand.
   ========================================================================== */

(function () {
  const { qs, qsa, el } = LatinTools;

  const pasteArea = qs("#pasteArea");
  const outputArea = qs("#outputArea");
  const outputCard = qs("#outputCard");
  const errorCard = qs("#errorCard");
  const errorText = qs("#errorText");
  const generateBtn = qs("#generateBtn");
  const copyBtn = qs("#copyBtn");
  const copyStatus = qs("#copyStatus");
  const simpleOptions = qs("#simpleOptions");
  const csvOptions = qs("#csvOptions");

  qsa('input[name="fmt"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const isSimple = qs('input[name="fmt"]:checked').value === "simple";
      simpleOptions.style.display = isSimple ? "block" : "none";
      csvOptions.style.display = isSimple ? "none" : "block";
    });
  });

  function showError(msg) {
    errorText.textContent = msg;
    errorCard.style.display = "block";
    outputCard.style.display = "none";
  }

  function jsStringLiteral(str) {
    return JSON.stringify(String(str == null ? "" : str).trim());
  }

  function makeId(prefix, index) {
    return `${prefix}${Date.now().toString(36)}${index}`;
  }

  function splitSimpleLine(line) {
    if (line.includes("\t")) return line.split("\t");
    // fall back to comma, but only split on the FIRST comma so
    // "puella, puellae" (a headword with its genitive) isn't broken apart
    const idx = line.indexOf(",");
    if (idx === -1) return [line];
    return [line.slice(0, idx), line.slice(idx + 1)];
  }

  function parseSimple(text) {
    const order = qs("#simpleOrder").value;
    const pos = qs("#simplePos").value;
    const chapter = qs("#simpleChapter").value.trim() || "Unlabeled";
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) throw new Error("Paste at least one line of Term / Definition.");

    return lines.map((line, i) => {
      const parts = splitSimpleLine(line).map((p) => p.trim());
      if (parts.length < 2) throw new Error(`Line ${i + 1} doesn't have two columns: "${line}"`);
      const [first, second] = parts;
      const latin = order === "latin-first" ? first : second;
      const english = order === "latin-first" ? second : first;
      return {
        id: makeId("v", i),
        latin, english, pos,
        gender: "", declension: null, conjugation: null,
        chapter, notes: ""
      };
    });
  }

  function parseCSVLine(line) {
    // minimal CSV split that respects "quoted, fields"
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { cur += ch; }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === "," || ch === "\t") {
        out.push(cur); cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  }

  function parseCSV(text) {
    const lines = text.split(/\r?\n/).map((l) => l).filter((l) => l.trim().length);
    if (lines.length < 2) throw new Error("Include a header row plus at least one data row.");
    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
    if (!headers.includes("latin") || !headers.includes("english")) {
      throw new Error('Header row must include at least "latin" and "english" columns.');
    }
    return lines.slice(1).map((line, i) => {
      const cells = parseCSVLine(line);
      const row = {};
      headers.forEach((h, idx) => { row[h] = cells[idx] !== undefined ? cells[idx] : ""; });
      if (!row.latin || !row.english) throw new Error(`Row ${i + 2} is missing latin or english.`);
      return {
        id: makeId("v", i),
        latin: row.latin,
        english: row.english,
        pos: row.pos || "other",
        gender: row.gender || "",
        declension: row.declension ? Number(row.declension) || row.declension : null,
        conjugation: row.conjugation ? (isNaN(Number(row.conjugation)) ? row.conjugation : Number(row.conjugation)) : null,
        chapter: row.chapter || "Unlabeled",
        notes: row.notes || ""
      };
    });
  }

  function toEntryText(entry) {
    const parts = [
      `id: ${jsStringLiteral(entry.id)}`,
      `latin: ${jsStringLiteral(entry.latin)}`,
      `english: ${jsStringLiteral(entry.english)}`,
      `pos: ${jsStringLiteral(entry.pos)}`,
      `gender: ${jsStringLiteral(entry.gender)}`,
      `declension: ${entry.declension === null ? "null" : JSON.stringify(entry.declension)}`,
      `conjugation: ${entry.conjugation === null ? "null" : JSON.stringify(entry.conjugation)}`,
      `chapter: ${jsStringLiteral(entry.chapter)}`,
      `notes: ${jsStringLiteral(entry.notes)}`
    ];
    return `  { ${parts.join(", ")} },`;
  }

  generateBtn.addEventListener("click", () => {
    errorCard.style.display = "none";
    const fmt = qs('input[name="fmt"]:checked').value;
    const text = pasteArea.value;
    if (!text.trim()) { showError("Paste some vocabulary first."); return; }
    try {
      const entries = fmt === "simple" ? parseSimple(text) : parseCSV(text);
      outputArea.value = entries.map(toEntryText).join("\n");
      outputCard.style.display = "block";
      copyStatus.textContent = "";
    } catch (err) {
      showError(err.message);
    }
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(outputArea.value);
      copyStatus.textContent = "Copied!";
    } catch (e) {
      outputArea.select();
      copyStatus.textContent = "Press Ctrl/Cmd+C to copy (auto-copy unavailable here).";
    }
  });
})();
