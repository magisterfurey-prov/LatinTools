/* ==========================================================================
   Grammar charts page logic.
   Reads window.GRAMMAR_CHARTS (data/grammarCharts.js) and LatinTools.
   ========================================================================== */

(function () {
  const { qs, qsa, el, latinAnswersMatch } = LatinTools;

  const categorySelect = qs("#categorySelect");
  const chartSelect = qs("#chartSelect");
  const chartArea = qs("#chartArea");
  const scoreBanner = qs("#scoreBanner");
  const checkAllBtn = qs("#checkAllBtn");
  const revealBtn = qs("#revealBtn");
  const clearBtn = qs("#clearBtn");

  function currentCategoryData() {
    return window.GRAMMAR_CHARTS[categorySelect.value] || [];
  }

  function populateChartSelect() {
    const charts = currentCategoryData();
    chartSelect.innerHTML = "";
    charts.forEach((c) => chartSelect.appendChild(el("option", { value: c.id, text: c.label })));
  }

  function buildTable(caption, colsHeader, rows, chartId, blockIndex) {
    const table = el("table", { class: "chart-table" });
    const captionEl = el("caption", { text: caption });
    table.appendChild(captionEl);

    const thead = el("thead");
    const headRow = el("tr", {}, [
      el("th", { text: "" }),
      ...colsHeader.map((c) => el("th", { text: c }))
    ]);
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = el("tbody");
    rows.forEach((row, rowIndex) => {
      const tr = el("tr", {}, [el("th", { text: row.label })]);
      row.answers.forEach((answer, colIndex) => {
        const input = el("input", {
          type: "text",
          class: "chart-input",
          autocomplete: "off",
          autocapitalize: "off",
          spellcheck: "false"
        });
        input.dataset.answer = answer;
        input.dataset.chart = chartId;
        input.dataset.block = blockIndex;
        input.dataset.row = rowIndex;
        input.dataset.col = colIndex;
        const td = el("td", {}, [input]);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    const wrap = el("div", { class: "chart-table-wrap" }, [table]);
    return wrap;
  }

  function renderChart() {
    chartArea.innerHTML = "";
    scoreBanner.innerHTML = "";
    const charts = currentCategoryData();
    const chart = charts.find((c) => c.id === chartSelect.value);
    if (!chart) return;

    if (chart.blocks) {
      chart.blocks.forEach((block, i) => {
        chartArea.appendChild(buildTable(`${chart.label} — ${block.label}`, block.colsHeader, block.rows, chart.id, i));
      });
    } else {
      chartArea.appendChild(buildTable(chart.label, chart.colsHeader, chart.rows, chart.id, 0));
    }
  }

  function allInputs() { return qsa(".chart-input", chartArea); }

  function checkAll() {
    const inputs = allInputs();
    if (!inputs.length) return;
    let correct = 0;
    inputs.forEach((input) => {
      const isCorrect = input.value.trim() !== "" && latinAnswersMatch(input.value, input.dataset.answer);
      input.classList.toggle("correct", isCorrect);
      input.classList.toggle("incorrect", !isCorrect);
      if (isCorrect) correct++;
    });
    const total = inputs.length;
    const pct = Math.round((correct / total) * 100);
    scoreBanner.innerHTML = "";
    scoreBanner.appendChild(el("div", {
      class: "score-banner " + (pct === 100 ? "good" : "mixed"),
      text: `${correct} / ${total} correct (${pct}%)${pct === 100 ? " — great work!" : ""}`
    }));
  }

  function revealAll() {
    allInputs().forEach((input) => {
      input.value = input.dataset.answer;
      input.classList.add("correct");
      input.classList.remove("incorrect");
    });
    scoreBanner.innerHTML = "";
    scoreBanner.appendChild(el("div", { class: "score-banner mixed", text: "Answers revealed — try clearing the chart and testing yourself again." }));
  }

  function clearAll() {
    allInputs().forEach((input) => {
      input.value = "";
      input.classList.remove("correct", "incorrect");
    });
    scoreBanner.innerHTML = "";
  }

  categorySelect.addEventListener("change", () => { populateChartSelect(); renderChart(); });
  chartSelect.addEventListener("change", renderChart);
  checkAllBtn.addEventListener("click", checkAll);
  revealBtn.addEventListener("click", revealAll);
  clearBtn.addEventListener("click", clearAll);

  populateChartSelect();
  renderChart();
})();
