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
