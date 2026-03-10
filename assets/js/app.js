"use strict";

(function initMenuToggle() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const backdrop = document.querySelector(".nav-backdrop");

  if (!toggle || !nav || !backdrop) return;

  function setMenuState(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    backdrop.classList.toggle("is-visible", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  toggle.addEventListener("click", function () {
    const isOpen = !nav.classList.contains("is-open");
    setMenuState(isOpen);
  });

  backdrop.addEventListener("click", function () {
    setMenuState(false);
  });
})();

(function initSearchChips() {
  const chips = document.querySelectorAll(".chip");
  const input = document.querySelector("#global-search");

  if (!chips.length || !input) return;

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      input.value = chip.textContent ? chip.textContent.trim() : "";
      input.focus();
    });
  });
})();

(function initProcedureFilterDemo() {
  const form = document.querySelector("#procedure-filter-form");
  const tableBody = document.querySelector("#procedure-table-body");
  const clearButton = document.querySelector("#clear-filter");

  if (!form || !tableBody) return;

  const rows = Array.from(tableBody.querySelectorAll("tr"));

  function normalize(text) {
    return text.toLowerCase().trim();
  }

  function applyFilter() {
    const formData = new FormData(form);
    const agency = normalize(String(formData.get("agency") || ""));
    const field = normalize(String(formData.get("field") || ""));
    const level = normalize(String(formData.get("level") || ""));
    const keyword = normalize(String(formData.get("keyword") || ""));

    rows.forEach(function (row) {
      const cells = row.querySelectorAll("td");
      const rowAgency = normalize(cells[1].textContent || "");
      const rowField = normalize(cells[2].textContent || "");
      const rowLevel = normalize(cells[3].textContent || "");
      const rowText = normalize(row.textContent || "");

      const matchAgency = !agency || rowAgency.includes(agency);
      const matchField = !field || rowField.includes(field.replace("-", " "));
      const matchLevel = !level || rowLevel.includes(level);
      const matchKeyword = !keyword || rowText.includes(keyword);

      row.hidden = !(matchAgency && matchField && matchLevel && matchKeyword);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    applyFilter();
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      setTimeout(function () {
        rows.forEach(function (row) {
          row.hidden = false;
        });
      }, 0);
    });
  }
})();

(function initQaFilterDemo() {
  const form = document.querySelector("#qa-filter-form");
  const cards = Array.from(document.querySelectorAll(".qa-card"));

  if (!form || !cards.length) return;

  function normalize(text) {
    return text.toLowerCase().trim();
  }

  function applyFilter() {
    const data = new FormData(form);
    const field = normalize(String(data.get("field") || ""));
    const status = normalize(String(data.get("status") || ""));
    const keyword = normalize(String(data.get("keyword") || ""));

    cards.forEach(function (card) {
      const content = normalize(card.textContent || "");
      const cardStatus = normalize(card.getAttribute("data-status") || "");
      const matchField = !field || content.includes(field.replace("-", " "));
      const matchStatus = !status || cardStatus === status;
      const matchKeyword = !keyword || content.includes(keyword);
      card.hidden = !(matchField && matchStatus && matchKeyword);
    });
  }

  form.addEventListener("input", applyFilter);
})();

(function initNewsFilterDemo() {
  const form = document.querySelector("#news-filter-form");
  const records = Array.from(document.querySelectorAll(".news-record"));
  if (!form || !records.length) return;

  function normalize(text) {
    return text.toLowerCase().trim();
  }

  function applyFilter() {
    const data = new FormData(form);
    const keyword = normalize(String(data.get("keyword") || ""));
    const category = normalize(String(data.get("category") || ""));
    const time = normalize(String(data.get("time") || ""));

    records.forEach(function (record) {
      const text = normalize(record.textContent || "");
      const rowCategory = normalize(record.getAttribute("data-category") || "");
      const rowTime = normalize(record.getAttribute("data-time") || "");
      const matchKeyword = !keyword || text.includes(keyword);
      const matchCategory = !category || rowCategory === category;
      const matchTime = !time || rowTime === time;
      record.hidden = !(matchKeyword && matchCategory && matchTime);
    });
  }

  form.addEventListener("input", applyFilter);
})();

(function initDocFilterDemo() {
  const form = document.querySelector("#doc-filter-form");
  const rows = Array.from(document.querySelectorAll(".doc-row"));
  const chips = Array.from(document.querySelectorAll(".doc-filter-chip"));
  if (!form || !rows.length) return;

  function normalize(text) {
    return text.toLowerCase().trim();
  }

  function applyFilter(forcedType) {
    const data = new FormData(form);
    const keyword = normalize(String(data.get("keyword") || ""));
    const docType = normalize(forcedType || String(data.get("doc_type") || ""));
    const status = normalize(String(data.get("status") || ""));
    const year = normalize(String(data.get("year") || ""));

    rows.forEach(function (row) {
      const rowType = normalize(row.getAttribute("data-doc-type") || "");
      const rowStatus = normalize(row.getAttribute("data-status") || "");
      const rowYear = normalize(row.getAttribute("data-year") || "");
      const text = normalize(row.textContent || "");
      const matchKeyword = !keyword || text.includes(keyword);
      const matchType = !docType || rowType === docType;
      const matchStatus = !status || rowStatus === status;
      const matchYear = !year || rowYear === year;
      row.hidden = !(matchKeyword && matchType && matchStatus && matchYear);
    });
  }

  form.addEventListener("input", function () {
    applyFilter("");
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      applyFilter(chip.getAttribute("data-doc-filter") || "");
    });
  });
})();

(function initPublicResultFilterDemo() {
  const form = document.querySelector("#public-result-filter-form");
  const rows = Array.from(document.querySelectorAll(".public-result-row"));
  if (!form || !rows.length) return;

  function normalize(text) {
    return text.toLowerCase().trim();
  }

  function applyFilter() {
    const data = new FormData(form);
    const recordCode = normalize(String(data.get("record_code") || ""));
    const group = normalize(String(data.get("procedure_group") || ""));
    const resultStatus = normalize(String(data.get("result_status") || ""));
    const time = normalize(String(data.get("time") || ""));

    rows.forEach(function (row) {
      const rowGroup = normalize(row.getAttribute("data-procedure-group") || "");
      const rowStatus = normalize(row.getAttribute("data-result-status") || "");
      const rowTime = normalize(row.getAttribute("data-time") || "");
      const text = normalize(row.textContent || "");

      const matchCode = !recordCode || text.includes(recordCode);
      const matchGroup = !group || rowGroup === group;
      const matchStatus = !resultStatus || rowStatus === resultStatus;
      const matchTime = !time || rowTime === time;

      row.hidden = !(matchCode && matchGroup && matchStatus && matchTime);
    });
  }

  form.addEventListener("input", applyFilter);
})();
