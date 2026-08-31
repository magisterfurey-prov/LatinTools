/* ==========================================================================
   Flashcards page logic.
   Reads window.VOCAB_DATA (data/vocabulary.js) and LatinTools (js/main.js).
   ========================================================================== */

(function () {
  const { qs, qsa, el, shuffle, loadJSON, saveJSON, normalizeLatin, normalizeEnglish } = LatinTools;

  const ALL_CARDS = Array.isArray(window.VOCAB_DATA) ? window.VOCAB_DATA : [];
  const PROGRESS_KEY = "flashcardProgress"; // { [cardId]: "known" | "unknown" }

  let progress = loadJSON(PROGRESS_KEY, {});
  let deck = [];
  let index = 0;
  let flipped = false;

  const chapterSelect = qs("#chapterSelect");
  const directionSelect = qs("#directionSelect");
  const modeSelect = qs("#modeSelect");
  const unknownOnly = qs("#unknownOnly");
  const shuffleBtn = qs("#shuffleBtn");
  const resetBtn = qs("#resetProgressBtn");
  const area = qs("#flashcardArea");
  const progressText = qs("#progressText");
  const knownText = qs("#knownText");
  const deckEmpty = qs("#deckEmpty");

  function primaryLatinHeadword(card) {
    // "puella, puellae" -> "puella"; "amō, amāre, amāvī, amātum" -> "amō"
    return card.latin.split(",")[0].trim();
  }

  function saveProgress() { saveJSON(PROGRESS_KEY, progress); }

  function populateChapters() {
    const chapters = Array.from(new Set(ALL_CARDS.map((c) => c.chapter).filter(Boolean)));
    chapterSelect.innerHTML = "";
    chapterSelect.appendChild(el("option", { value: "__all__", text: `All chapters (${ALL_CARDS.length} words)` }));
    chapters.forEach((ch) => {
      const count = ALL_CARDS.filter((c) => c.chapter === ch).length;
      chapterSelect.appendChild(el("option", { value: ch, text: `${ch} (${count} words)` }));
    });
  }

  function buildDeck() {
    const chosenChapter = chapterSelect.value;
    let cards = ALL_CARDS.filter((c) => chosenChapter === "__all__" || c.chapter === chosenChapter);
    if (unknownOnly.checked) {
      cards = cards.filter((c) => progress[c.id] !== "known");
    }
    deck = cards;
    index = 0;
    flipped = false;
    updateProgressLine();
    render();
  }

  function updateProgressLine() {
    const total = deck.length;
    progressText.textContent = total ? `Card ${Math.min(index + 1, total)} of ${total}` : "No cards";
    const chosenChapter = chapterSelect.value;
    const scope = ALL_CARDS.filter((c) => chosenChapter === "__all__" || c.chapter === chosenChapter);
    const knownCount = scope.filter((c) => progress[c.id] === "known").length;
    const unknownCount = scope.length - knownCount;
    knownText.textContent = `Know it: ${knownCount} · Still learning: ${unknownCount}`;
    deckEmpty.style.display = total ? "none" : "block";
  }

  function markKnown(card, known) {
    progress[card.id] = known ? "known" : "unknown";
    saveProgress();
    updateProgressLine();
  }

  function render() {
    area.innerHTML = "";
    if (!deck.length) return;
    const mode = modeSelect.value;
    if (mode === "flip") renderFlip();
    else if (mode === "choice") renderChoice();
    else renderTyping();
  }

  // ---------------- Flip mode ----------------

  function renderFlip() {
    const card = deck[index];
    const direction = directionSelect.value;
    const front = direction === "latin-to-english" ? primaryLatinHeadword(card) : card.english;
    const frontMeta = direction === "latin-to-english" ? "" : "";
    const back = direction === "latin-to-english" ? card.english : card.latin;

    const scene = el("div", { class: "flip-card-scene" });
    const cardEl = el("div", { class: "flip-card" + (flipped ? " is-flipped" : "") });
    const frontFace = el("div", { class: "flip-face front" }, [
      el("div", { class: "term", text: front }),
      frontMeta ? el("div", { class: "meta", text: frontMeta }) : null,
      el("div", { class: "hint", text: "click to flip" })
    ]);
    const backFace = el("div", { class: "flip-face back" }, [
      el("div", { class: "term", text: back }),
      el("div", { class: "meta", text: metaLine(card) }),
      card.notes ? el("div", { class: "meta", text: card.notes }) : null,
      el("div", { class: "hint", text: "click to flip" })
    ]);
    cardEl.appendChild(frontFace);
    cardEl.appendChild(backFace);
    cardEl.addEventListener("click", () => { flipped = !flipped; cardEl.classList.toggle("is-flipped"); });
    scene.appendChild(cardEl);
    area.appendChild(scene);

    const controls = el("div", { class: "flashcard-controls" }, [
      el("button", { class: "pill-btn unknown", text: "😕 Still learning", onclick: () => { markKnown(card, false); goNext(); } }),
      el("button", { class: "pill-btn", text: "⬅ Prev", onclick: () => goPrev() }),
      el("button", { class: "pill-btn", text: "Next ➡", onclick: () => goNext() }),
      el("button", { class: "pill-btn known", text: "✅ Know it", onclick: () => { markKnown(card, true); goNext(); } })
    ]);
    area.appendChild(controls);
  }

  function metaLine(card) {
    const parts = [];
    if (card.pos) parts.push(card.pos);
    if (card.declension) parts.push(`${ordinal(card.declension)} declension`);
    if (card.conjugation) parts.push(`${card.conjugation === "irregular" ? "irregular" : ordinal(card.conjugation).replace("th", "").replace("st","1st").replace("nd","2nd").replace("rd","3rd")} conjugation`);
    if (card.gender) parts.push(card.gender);
    return parts.join(" · ");
  }

  function ordinal(n) {
    const s = String(n);
    if (s === "3io") return "3rd -iō";
    const num = Number(n);
    if (Number.isNaN(num)) return s;
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  function goNext() {
    if (!deck.length) return;
    index = (index + 1) % deck.length;
    flipped = false;
    updateProgressLine();
    render();
  }

  function goPrev() {
    if (!deck.length) return;
    index = (index - 1 + deck.length) % deck.length;
    flipped = false;
    updateProgressLine();
    render();
  }

  // ---------------- Multiple choice mode ----------------

  function renderChoice() {
    const card = deck[index];
    const direction = directionSelect.value;
    const prompt = direction === "latin-to-english" ? primaryLatinHeadword(card) : card.english;
    const correctAnswer = direction === "latin-to-english" ? card.english : primaryLatinHeadword(card);

    const pool = ALL_CARDS.filter((c) => c.id !== card.id);
    const distractorPool = shuffle(pool).slice(0, 12);
    const distractors = [];
    for (const c of distractorPool) {
      const val = direction === "latin-to-english" ? c.english : primaryLatinHeadword(c);
      if (val && val !== correctAnswer && !distractors.includes(val)) distractors.push(val);
      if (distractors.length === 3) break;
    }
    const options = shuffle([correctAnswer, ...distractors]);

    area.appendChild(el("div", { class: "sentence-display", text: prompt }));
    const list = el("div");
    options.forEach((opt) => {
      const btn = el("button", { class: "quiz-choice", text: opt });
      btn.addEventListener("click", () => {
        qsa(".quiz-choice", list).forEach((b) => b.disabled = true);
        if (opt === correctAnswer) {
          btn.classList.add("correct");
          markKnown(card, true);
        } else {
          btn.classList.add("incorrect");
          markKnown(card, false);
          list.querySelectorAll(".quiz-choice").forEach((b2) => {
            if (b2.textContent === correctAnswer) b2.classList.add("correct");
          });
        }
        area.appendChild(el("div", { class: "btn-row" }, [
          el("button", { class: "btn", text: "Next word →", onclick: () => goNext() })
        ]));
      });
      list.appendChild(btn);
    });
    area.appendChild(list);
  }

  // ---------------- Typing mode ----------------

  function renderTyping() {
    const card = deck[index];
    const direction = directionSelect.value;
    const prompt = direction === "latin-to-english" ? primaryLatinHeadword(card) : card.english;
    const correctAnswer = direction === "latin-to-english" ? card.english : primaryLatinHeadword(card);

    area.appendChild(el("div", { class: "sentence-display", text: prompt }));

    const input = el("input", { type: "text", placeholder: direction === "latin-to-english" ? "Type the English meaning…" : "Type the Latin word…" });
    input.style.width = "100%";
    input.style.marginBottom = "0.75rem";

    const feedback = el("div", { class: "parse-feedback" });

    function check() {
      let isCorrect;
      if (direction === "latin-to-english") {
        isCorrect = LatinTools.englishAnswerMatches(input.value, [correctAnswer]);
      } else {
        isCorrect = LatinTools.latinAnswersMatch(input.value, correctAnswer);
      }
      feedback.textContent = isCorrect
        ? "✅ Correct!"
        : `❌ Not quite. Correct answer: ${correctAnswer}`;
      feedback.className = "parse-feedback " + (isCorrect ? "correct" : "incorrect");
      markKnown(card, isCorrect);
      input.disabled = true;
      area.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn", text: "Next word →", onclick: () => goNext() })
      ]));
    }

    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !input.disabled) check(); });

    area.appendChild(input);
    area.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn", text: "Check", onclick: () => { if (!input.disabled) check(); } })
    ]));
    area.appendChild(feedback);
    input.focus();
  }

  // ---------------- Wiring ----------------

  chapterSelect.addEventListener("change", buildDeck);
  unknownOnly.addEventListener("change", buildDeck);
  directionSelect.addEventListener("change", () => { flipped = false; render(); });
  modeSelect.addEventListener("change", () => { flipped = false; render(); });
  shuffleBtn.addEventListener("click", () => { deck = shuffle(deck); index = 0; flipped = false; updateProgressLine(); render(); });
  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset known/still-learning progress for all flashcards?")) return;
    progress = {};
    saveProgress();
    updateProgressLine();
    render();
  });

  populateChapters();
  buildDeck();
})();
