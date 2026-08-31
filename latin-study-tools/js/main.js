/* ==========================================================================
   Latin Study Tools — shared utilities used by every page.
   No build step, no framework: plain JS, loaded with <script src="js/main.js">
   before each page's own script.
   ========================================================================== */

const LatinTools = (() => {

  const STORAGE_PREFIX = "latinStudyTools:";

  /** Map of macron/breve vowels -> plain vowels, so students don't have to
   *  type long marks to get credit. Works for both cases. */
  const DIACRITIC_MAP = {
    "ā": "a", "Ā": "A", "ē": "e", "Ē": "E", "ī": "i", "Ī": "I",
    "ō": "o", "Ō": "O", "ū": "u", "Ū": "U", "ȳ": "y", "Ȳ": "Y",
    "ă": "a", "Ă": "A", "ĕ": "e", "Ĕ": "E", "ĭ": "i", "Ĭ": "I",
    "ŏ": "o", "Ŏ": "O", "ŭ": "u", "Ŭ": "U"
  };

  function stripMacrons(str) {
    return String(str).replace(/[āĀēĒīĪōŌūŪȳȲăĂĕĔĭĬŏŎŭŬ]/g, (ch) => DIACRITIC_MAP[ch] || ch);
  }

  /** Normalize a Latin word/phrase for comparison: strip macrons, lowercase,
   *  trim, collapse whitespace, drop surrounding punctuation. */
  function normalizeLatin(str) {
    return stripMacrons(String(str || ""))
      .toLowerCase()
      .replace(/[.,;:!?"'()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Normalize an English translation for comparison: lowercase, trim,
   *  collapse whitespace, drop most punctuation. Deliberately lenient —
   *  translation is graded as "exact-ish match, otherwise self-check". */
  function normalizeEnglish(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[.,;:!?"']/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function latinAnswersMatch(given, accepted) {
    return normalizeLatin(given) === normalizeLatin(accepted);
  }

  function englishAnswerMatches(given, acceptedList) {
    const norm = normalizeEnglish(given);
    if (!norm) return false;
    return acceptedList.some((a) => normalizeEnglish(a) === norm);
  }

  function shuffle(arrayIn) {
    const arr = arrayIn.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach((c) => { if (c) node.appendChild(c); });
    return node;
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      /* localStorage unavailable (private browsing, quota) — fail silently */
    }
  }

  function markActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    qsa("nav.site-nav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path) a.classList.add("active");
    });
  }

  document.addEventListener("DOMContentLoaded", markActiveNav);

  return {
    stripMacrons, normalizeLatin, normalizeEnglish,
    latinAnswersMatch, englishAnswerMatches,
    shuffle, qs, qsa, el, loadJSON, saveJSON
  };
})();
