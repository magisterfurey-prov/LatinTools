/* ==========================================================================
   Translation practice page logic.
   Reads window.SENTENCE_DATA, window.PARSE_FIELD_DEFS, window.USAGE_OPTIONS
   (data/sentences.js) and LatinTools (js/main.js).
   ========================================================================== */

(function () {
  const { qs, qsa, el, englishAnswerMatches } = LatinTools;

  const SENTENCES = Array.isArray(window.SENTENCE_DATA) ? window.SENTENCE_DATA : [];
  const FIELD_DEFS = window.PARSE_FIELD_DEFS || {};
  const USAGE_OPTIONS = window.USAGE_OPTIONS || [];

  const sentenceSelect = qs("#sentenceSelect");
  const prevBtn = qs("#prevBtn");
  const nextBtn = qs("#nextBtn");
  const sentenceDisplay = qs("#sentenceDisplay");
  const wordBlocks = qs("#wordBlocks");
  const checkParsingBtn = qs("#checkParsingBtn");
  const revealParsingBtn = qs("#revealParsingBtn");
  const resetBtn = qs("#resetBtn");
  const translationInput = qs("#translationInput");
  const checkTranslationBtn = qs("#checkTranslationBtn");
  const translationFeedback = qs("#translationFeedback");
  const modelAnswers = qs("#modelAnswers");

  let index = 0;

  function populateSentenceSelect() {
    sentenceSelect.innerHTML = "";
    SENTENCES.forEach((s, i) => {
      sentenceSelect.appendChild(el("option", { value: String(i), text: `${i + 1}. ${s.reference || s.latin}` }));
    });
  }

  function currentSentence() { return SENTENCES[index]; }

  function buildFieldSelect(fieldDef, wordIndex) {
    const select = el("select", { class: "parse-field", "data-field": fieldDef.key });
    select.appendChild(el("option", { value: "", text: `— ${fieldDef.label} —` }));
    fieldDef.options.forEach((opt) => select.appendChild(el("option", { value: opt, text: opt })));
    return select;
  }

  function buildUsageSelect() {
    const select = el("select", { class: "usage-field" });
    select.appendChild(el("option", { value: "", text: "— How is this word used? —" }));
    USAGE_OPTIONS.forEach((opt) => select.appendChild(el("option", { value: opt, text: opt })));
    return select;
  }

  function renderSentence() {
    const sentence = currentSentence();
    translationFeedback.innerHTML = "";
    modelAnswers.style.display = "none";
    modelAnswers.innerHTML = "";
    translationInput.value = "";
    wordBlocks.innerHTML = "";
    sentenceSelect.value = String(index);

    if (!sentence) {
      sentenceDisplay.textContent = "No sentences yet — add some to data/sentences.js.";
      return;
    }
    sentenceDisplay.textContent = sentence.latin;

    sentence.words.forEach((word, wordIndex) => {
      const fields = FIELD_DEFS[word.pos] || [];
      const block = el("div", { class: "word-parse-block", "data-word-index": wordIndex });
      block.appendChild(el("div", { class: "word-heading" }, [
        document.createTextNode(word.text),
        el("span", { class: "tag", text: word.pos })
      ]));

      const fieldRow = el("div", { class: "parse-fields" });
      fields.forEach((fieldDef) => fieldRow.appendChild(buildFieldSelect(fieldDef, wordIndex)));
      if (word.usage) fieldRow.appendChild(buildUsageSelect());
      block.appendChild(fieldRow);

      block.appendChild(el("div", { class: "parse-feedback" }));
      wordBlocks.appendChild(block);
    });
  }

  function checkParsing() {
    const sentence = currentSentence();
    if (!sentence) return;
    qsa(".word-parse-block", wordBlocks).forEach((block, wordIndex) => {
      const word = sentence.words[wordIndex];
      const feedback = qs(".parse-feedback", block);
      let allCorrect = true;
      const wrongFields = [];

      qsa(".parse-field", block).forEach((select) => {
        const key = select.dataset.field;
        const correct = word.parse ? word.parse[key] : undefined;
        const isRight = select.value !== "" && select.value === correct;
        select.style.borderColor = select.value === "" ? "" : (isRight ? "var(--color-correct)" : "var(--color-incorrect)");
        if (!isRight) { allCorrect = false; if (select.value !== "") wrongFields.push(key); }
      });

      const usageSelect = qs(".usage-field", block);
      if (usageSelect) {
        const isRight = usageSelect.value !== "" && usageSelect.value === word.usage;
        usageSelect.style.borderColor = usageSelect.value === "" ? "" : (isRight ? "var(--color-correct)" : "var(--color-incorrect)");
        if (!isRight) allCorrect = false;
      }

      const anyEmpty = qsa(".parse-field, .usage-field", block).some((s) => s.value === "");
      if (anyEmpty) {
        feedback.textContent = "Fill in every dropdown for this word, then check again.";
        feedback.className = "parse-feedback";
      } else if (allCorrect) {
        feedback.textContent = "✅ Correct!";
        feedback.className = "parse-feedback correct";
      } else {
        feedback.textContent = "❌ Not quite — check the highlighted dropdown(s).";
        feedback.className = "parse-feedback incorrect";
      }
    });
  }

  function revealParsing() {
    const sentence = currentSentence();
    if (!sentence) return;
    qsa(".word-parse-block", wordBlocks).forEach((block, wordIndex) => {
      const word = sentence.words[wordIndex];
      qsa(".parse-field", block).forEach((select) => {
        const key = select.dataset.field;
        if (word.parse && word.parse[key]) {
          select.value = word.parse[key];
          select.style.borderColor = "var(--color-correct)";
        }
      });
      const usageSelect = qs(".usage-field", block);
      if (usageSelect && word.usage) {
        usageSelect.value = word.usage;
        usageSelect.style.borderColor = "var(--color-correct)";
      }
      const feedback = qs(".parse-feedback", block);
      feedback.textContent = "Answers revealed.";
      feedback.className = "parse-feedback";
    });
  }

  function resetSentence() { renderSentence(); }

  function checkTranslation() {
    const sentence = currentSentence();
    if (!sentence) return;
    const isCorrect = englishAnswerMatches(translationInput.value, sentence.acceptableTranslations || []);
    if (isCorrect) {
      translationFeedback.innerHTML = "";
      translationFeedback.appendChild(el("div", { class: "parse-feedback correct", text: "✅ Correct!" }));
      modelAnswers.style.display = "none";
    } else {
      translationFeedback.innerHTML = "";
      translationFeedback.appendChild(el("div", { class: "parse-feedback incorrect", text: "Not an exact match to the model answer(s) — compare your translation below and self-check the meaning." }));
      modelAnswers.innerHTML = "";
      modelAnswers.appendChild(el("strong", { text: "Model translation(s):" }));
      const list = el("ul");
      (sentence.acceptableTranslations || []).forEach((t) => list.appendChild(el("li", { text: t })));
      modelAnswers.appendChild(list);
      modelAnswers.style.display = "block";
    }
  }

  function goTo(newIndex) {
    if (!SENTENCES.length) return;
    index = ((newIndex % SENTENCES.length) + SENTENCES.length) % SENTENCES.length;
    renderSentence();
  }

  sentenceSelect.addEventListener("change", () => goTo(Number(sentenceSelect.value)));
  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
  checkParsingBtn.addEventListener("click", checkParsing);
  revealParsingBtn.addEventListener("click", revealParsing);
  resetBtn.addEventListener("click", resetSentence);
  checkTranslationBtn.addEventListener("click", checkTranslation);

  populateSentenceSelect();
  renderSentence();
})();
