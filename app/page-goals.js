// DompetKita — Goals page: the four savings targets, each with a ring,
// what is saved, what is left, and how many months it still needs at the
// family's current saving pace. Top-ups go straight into the saved total.

import { rupiah, persen } from "./format.js";
import { goalRing } from "./charts.js";
import { pageHead } from "./ui.js";
import { goals, addToGoal, monthSummary, currentMonth } from "./store.js";

export function renderGoals(root) {
  const list = goals();
  const saving = monthSummary(currentMonth()).left;
  const totalSaved = list.reduce((s, g) => s + g.saved, 0);
  const totalTarget = list.reduce((s, g) => s + g.target, 0);

  const cards = list.map((g) => {
    const pct = (g.saved / g.target) * 100;
    const left = g.target - g.saved;
    // ETA assumes Rp 1,5 jt a month goes to this one goal — the page says so.
    const months = saving > 0 && left > 0 ? Math.ceil(left / Math.min(saving, 1500000)) : 0;
    const eta = left <= 0
      ? "Tercapai — selamat!"
      : "Sekitar " + months + " bulan lagi dengan menabung Rp 1,5 jt/bulan untuk target ini.";
    return (
      '<article class="goal-card">' +
      goalRing(pct, "#15803d") +
      '<div class="goal-body"><h3>' + g.name + "</h3>" +
      "<p>" + g.note + "</p>" +
      '<p class="goal-nums"><strong>' + rupiah(g.saved) + "</strong> dari " + rupiah(g.target) +
      " · kurang " + rupiah(left) + "</p>" +
      '<div class="goal-bar"><span style="width:' + Math.min(pct, 100) + '%"></span></div>' +
      '<p class="goal-eta">' + eta + "</p>" +
      '<div class="goal-add"><label>Tambah tabungan (Rp) ' +
      '<input type="number" min="10000" step="10000" value="250000" data-amount="' + g.id + '"></label>' +
      '<button type="button" class="btn-primary" data-topup="' + g.id + '">Menabung</button></div>' +
      "</div></article>"
    );
  }).join("\n");

  root.innerHTML =
    pageHead("Tujuan Menabung", "Empat hal yang sedang dikejar Keluarga Santoso — total " + rupiah(totalSaved) + " dari " + rupiah(totalTarget) + " (" + persen(totalSaved / totalTarget) + ").") +
    '<p class="intro">Sisa uang tiap bulan — sekitar ' + rupiah(saving) + ' — dibagi ke empat tujuan ini. ' +
    "Menabung di sini langsung menambah saldo tujuan dan tersimpan di peramban ini.</p>" +
    '<div class="goal-list">' + cards + "</div>";

  root.querySelectorAll("[data-topup]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-topup");
      const input = root.querySelector('[data-amount="' + id + '"]');
      const amount = Math.round(Number(input.value));
      if (Number.isFinite(amount) && amount > 0 && addToGoal(id, amount)) {
        renderGoals(root);
      }
    });
  });
}
