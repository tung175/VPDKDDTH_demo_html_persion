"use strict";

(function initRoleSwitcher() {
  const roleSelect = document.querySelector("#role-switcher");
  const storageKey = "admin_role";
  const allowed = ["super_admin", "bien_tap_vien", "kiem_duyet_vien", "chuyen_vien"];

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
  }

  const cached = localStorage.getItem(storageKey);
  applyRole(cached || "super_admin");

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
    });
  });
})();
