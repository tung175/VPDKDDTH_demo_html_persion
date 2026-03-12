"use strict";

(function initContracts() {
  window.AdminContracts = {
    ItemStatus: ["draft", "review", "approved", "published", "archived", "scheduled"],
    SlaState: ["ok", "warning", "breach"],
    Role: ["super_admin", "bien_tap_vien", "kiem_duyet_vien", "chuyen_vien"],
    ListRowSchema: ["id", "title", "type", "status", "owner", "updated_at", "sla_state", "actions"],
    UIEvents: [
      "role_changed",
      "filter_changed",
      "bulk_action_triggered",
      "approval_submitted",
      "editor_autosaved"
    ]
  };
})();

function emitUIEvent(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
}

(function initRoleSwitcher() {
  const roleSelect = document.querySelector("#role-switcher");
  const storageKey = "admin_role";
  const allowed = window.AdminContracts.Role;

  function applyRole(role) {
    const safeRole = allowed.includes(role) ? role : "super_admin";
    document.body.classList.remove(
      "role-super_admin",
      "role-bien_tap_vien",
      "role-kiem_duyet_vien",
      "role-chuyen_vien"
    );
    document.body.classList.add("role-" + safeRole);
    if (roleSelect) roleSelect.value = safeRole;
    localStorage.setItem(storageKey, safeRole);
    emitUIEvent("role_changed", { role: safeRole });
  }

  applyRole(localStorage.getItem(storageKey) || "super_admin");

  if (roleSelect) {
    roleSelect.addEventListener("change", function () {
      applyRole(roleSelect.value);
    });
  }
})();

(function initStateButtons() {
  const buttons = document.querySelectorAll("[data-show-state]");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetId = btn.getAttribute("data-target");
      const state = btn.getAttribute("data-show-state");
      if (!targetId || !state) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      target.querySelectorAll("[data-state]").forEach(function (node) {
        node.hidden = node.getAttribute("data-state") !== state;
      });
      buttons.forEach(function (node) {
        node.classList.remove("primary");
        node.classList.add("secondary");
      });
      btn.classList.remove("secondary");
      btn.classList.add("primary");
      emitUIEvent("filter_changed", { control: "state_preview", value: state });
    });
  });
})();

(function initQuickCommand() {
  const triggerButtons = document.querySelectorAll(".command-trigger");
  const searchInput = document.querySelector("[data-command-input]") || document.querySelector('.topbar input[type="search"]');
  const navLinks = Array.from(document.querySelectorAll(".sidebar .nav-link:not(.disabled)"));
  const quickButtons = Array.from(document.querySelectorAll(".actions .btn, .actions a.btn")).filter(function (node) {
    const style = window.getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden";
  });

  if (!searchInput) return;

  const commands = [];

  navLinks.forEach(function (link) {
    const label = link.textContent.trim();
    const href = link.getAttribute("href");
    if (!label || !href || href === "#") return;
    commands.push({ label: label, hint: "Đi tới module", href: href, action: "go" });
  });

  quickButtons.forEach(function (btn) {
    const label = btn.textContent.trim();
    if (!label) return;
    if (btn.tagName.toLowerCase() === "a") {
      const href = btn.getAttribute("href");
      if (href && href !== "#") {
        commands.push({ label: label, hint: "Quick action", href: href, action: "go" });
      }
      return;
    }
    commands.push({ label: label, hint: "Quick action", button: btn, action: "click" });
  });

  if (!commands.length) return;

  const layer = document.createElement("div");
  layer.className = "command-layer";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML =
    '<div class="command-panel" role="dialog" aria-label="Quick command">' +
    '<header><input type="search" placeholder="Tìm command: module, hành động, workflow..."></header>' +
    '<ul class="command-list"></ul>' +
    '</div>';
  document.body.appendChild(layer);

  const layerInput = layer.querySelector("input");
  const list = layer.querySelector(".command-list");
  let filtered = commands.slice();
  let currentIndex = 0;

  function renderList() {
    list.innerHTML = "";
    if (!filtered.length) {
      const li = document.createElement("li");
      li.innerHTML = '<button type="button" disabled>Không có kết quả phù hợp</button>';
      list.appendChild(li);
      return;
    }

    filtered.slice(0, 10).forEach(function (item, index) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      if (index === currentIndex) button.classList.add("active");
      button.innerHTML =
        '<strong>' + item.label + '</strong>' +
        '<div style="font-size:0.78rem;color:#6b829a;">' + item.hint + '</div>';
      button.addEventListener("click", function () {
        executeCommand(item);
      });
      li.appendChild(button);
      list.appendChild(li);
    });
  }

  function executeCommand(item) {
    closeLayer();
    if (item.action === "go" && item.href) {
      window.location.href = item.href;
      return;
    }
    if (item.action === "click" && item.button) {
      item.button.click();
    }
  }

  function openLayer(query) {
    layer.classList.add("open");
    layer.setAttribute("aria-hidden", "false");
    layerInput.value = query || "";
    currentIndex = 0;
    applyFilter();
    layerInput.focus();
  }

  function closeLayer() {
    layer.classList.remove("open");
    layer.setAttribute("aria-hidden", "true");
  }

  function applyFilter() {
    const q = layerInput.value.trim().toLowerCase();
    filtered = !q ? commands.slice() : commands.filter(function (item) {
      return item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q);
    });
    currentIndex = 0;
    renderList();
  }

  triggerButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLayer("");
    });
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      openLayer(searchInput.value);
    }
  });

  document.addEventListener("keydown", function (event) {
    const isMod = event.ctrlKey || event.metaKey;
    if (isMod && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openLayer(searchInput.value);
      return;
    }
    if (event.key === "Escape") {
      closeLayer();
    }
  });

  layer.addEventListener("click", function (event) {
    if (event.target === layer) closeLayer();
  });

  layerInput.addEventListener("input", applyFilter);

  layerInput.addEventListener("keydown", function (event) {
    if (!filtered.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      currentIndex = Math.min(currentIndex + 1, Math.min(filtered.length, 10) - 1);
      renderList();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      currentIndex = Math.max(currentIndex - 1, 0);
      renderList();
    }

    if (event.key === "Enter") {
      event.preventDefault();
      executeCommand(filtered[currentIndex]);
    }
  });
})();

(function initKpiCards() {
  document.querySelectorAll("[data-href]").forEach(function (node) {
    node.classList.add("interactive");
    node.tabIndex = 0;

    function go() {
      const href = node.getAttribute("data-href");
      if (href) window.location.href = href;
    }

    node.addEventListener("click", go);
    node.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        go();
      }
    });
  });
})();

(function initFilterEvents() {
  document.querySelectorAll(".filter-bar input, .filter-bar select").forEach(function (control) {
    const eventName = control.tagName.toLowerCase() === "input" ? "input" : "change";
    control.addEventListener(eventName, function () {
      emitUIEvent("filter_changed", {
        control: control.name || control.id || control.placeholder || "filter",
        value: control.value || ""
      });
    });
  });
})();

(function initBulkSelection() {
  const tables = document.querySelectorAll("table[data-selectable]");
  tables.forEach(function (table) {
    const selectAll = table.querySelector("thead input[type='checkbox']");
    const rowChecks = Array.from(table.querySelectorAll("tbody input[type='checkbox']"));
    const counterTarget = document.querySelector(table.getAttribute("data-counter-target"));

    function syncCount() {
      const count = rowChecks.filter(function (cb) { return cb.checked; }).length;
      if (counterTarget) counterTarget.textContent = String(count);
    }

    if (selectAll) {
      selectAll.addEventListener("change", function () {
        rowChecks.forEach(function (cb) {
          cb.checked = selectAll.checked;
        });
        syncCount();
      });
    }

    rowChecks.forEach(function (cb) {
      cb.addEventListener("change", syncCount);
    });

    syncCount();
  });

  document.querySelectorAll("[data-bulk-action]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      emitUIEvent("bulk_action_triggered", { action: btn.getAttribute("data-bulk-action") || "bulk" });
    });
  });
})();

(function initDensityToggle() {
  document.querySelectorAll("[data-density-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetSelector = btn.getAttribute("data-density-target");
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;

      const current = target.getAttribute("data-density") || "normal";
      const next = current === "normal" ? "compact" : "normal";
      target.setAttribute("data-density", next);
      emitUIEvent("filter_changed", { control: "density", value: next });
    });
  });
})();

(function initApprovalDrawer() {
  const drawer = document.getElementById("approval-drawer");
  if (!drawer) return;

  const titleNode = drawer.querySelector("[data-approval-title]");
  const closeNodes = drawer.querySelectorAll("[data-close-drawer]");
  const form = drawer.querySelector("form");

  function openDrawer(title) {
    if (titleNode) titleNode.textContent = title || "Nội dung cần duyệt";
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-open-approval]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openDrawer(btn.getAttribute("data-item-title"));
    });
  });

  closeNodes.forEach(function (node) {
    node.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeDrawer();
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const action = form.querySelector("[name='approval_action']")?.value || "approve";
      emitUIEvent("approval_submitted", { action: action });
      closeDrawer();
    });
  }
})();

(function initEditorAutosave() {
  const form = document.querySelector("[data-editor-form]");
  if (!form) return;

  const fields = form.querySelectorAll("input, textarea, select");
  const statusNode = document.getElementById("autosave-status");
  const previewTitle = document.querySelector("[data-preview-title]");
  const previewSummary = document.querySelector("[data-preview-summary]");
  const titleInput = form.querySelector("[name='title']");
  const summaryInput = form.querySelector("[name='summary']");
  let timer = null;

  function setStatus(text) {
    if (statusNode) statusNode.textContent = text;
  }

  function scheduleSave() {
    setStatus("Đang đồng bộ bản nháp...");
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      const now = new Date();
      const stamp = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      setStatus("Đã tự động lưu lúc " + stamp);
      emitUIEvent("editor_autosaved", { at: now.toISOString() });
    }, 900);
  }

  fields.forEach(function (field) {
    field.addEventListener("input", scheduleSave);
  });

  if (titleInput && previewTitle) {
    titleInput.addEventListener("input", function () {
      previewTitle.textContent = titleInput.value || "[Chưa có tiêu đề]";
    });
  }

  if (summaryInput && previewSummary) {
    summaryInput.addEventListener("input", function () {
      previewSummary.textContent = summaryInput.value || "Tóm tắt sẽ hiển thị tại đây.";
    });
  }
})();

(function initMediaPreview() {
  const preview = document.getElementById("media-preview-panel");
  if (!preview) return;

  const nameNode = preview.querySelector("[data-preview-name]");
  const metaNode = preview.querySelector("[data-preview-meta]");
  const usageNode = preview.querySelector("[data-preview-usage]");

  document.querySelectorAll("[data-media-item]").forEach(function (card) {
    card.addEventListener("click", function () {
      if (nameNode) nameNode.textContent = card.getAttribute("data-media-name") || "Media item";
      if (metaNode) metaNode.textContent = card.getAttribute("data-media-meta") || "Chưa có metadata";
      if (usageNode) usageNode.textContent = card.getAttribute("data-media-usage") || "Chưa được sử dụng";
    });
  });
})();
