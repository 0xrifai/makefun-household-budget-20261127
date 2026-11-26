// DompetKita — Budgets page: one card per category with its monthly cap,
// what is spent so far, and a bar that turns red past the cap.
// The cap itself is editable, so the family can retune a category.

import { rupiah, persen, clamp01, namaBulan } from "./format.js";
import { monthSwitcher, pageHead } from "./ui.js";
import { TOTAL_BUDGET } from "./data.js";
import { currentMonth, monthByCategory, monthSummary, setBudget } from "./store.js";

export function renderBudgets(root) {
  const m = currentMonth();
  const cats = monthByCategory(m);
  const sum = monthSummary(m);
  const totalBudget = cats.reduce((s, c) => s + c.budget, 0);
  const over = cats.filter((c) => c.spent > c.budget);

  const cards = cats.map((c) => {
    const ratio = c.budget > 0 ? c.spent / c.budget : 0;
    const left = c.budget - c.spent;
    const state = ratio > 1 ? "over" : ratio > 0.8 ? "warm" : "ok";
    const stateText = ratio > 1
      ? "Melewati anggaran " + rupiah(-left)
      : ratio > 0.8
        ? "Hampir habis — sisa " + rupiah(left)
        : "Sisa " + rupiah(left);
    return (
      '<article class="budget-card budget-' + state + '">' +
      '<header><span class="swatch" style="background:' + c.color + '"></span>' +
      "<h3>" + c.name + "</h3>" +
      '<span class="budget-pct">' + persen(ratio) + "</span></header>" +
      '<div class="budget-bar"><span style="width:' + Math.round(clamp01(ratio) * 100) + "%;background:" + c.color + '"></span></div>' +
      "<p><strong>" + rupiah(c.spent) + "</strong> dari " + rupiah(c.budget) + "</p>" +
      '<p class="budget-state">' + stateText + "</p>" +
      '<button type="button" class="mini-btn" data-budget="' + c.id + '">Ubah anggaran</button>' +
      "</article>"
    );
  }).join("\n");

  root.innerHTML =
    pageHead("Anggaran", "Batas belanja tiap kategori untuk " + namaBulan(m) + " — total " + rupiah(totalBudget) + ".") +
    monthSwitcher() +
    '<div class="stat-grid stat-grid-3">' +
    '<div class="stat"><span class="stat-label">Total anggaran</span><strong class="stat-value">' + rupiah(totalBudget) + "</strong></div>" +
    '<div class="stat stat-out"><span class="stat-label">Terpakai</span><strong class="stat-value">' + rupiah(sum.expense) + "</strong></div>" +
    '<div class="stat stat-left"><span class="stat-label">Masih tersedia</span><strong class="stat-value">' + rupiah(totalBudget - sum.expense) + "</strong></div>" +
    "</div>" +
    (over.length
      ? '<div class="alert"><strong>' + over.length + " kategori melewati anggaran:</strong> " +
        over.map((c) => c.name + " (" + persen(c.spent / c.budget) + ")").join(", ") + ".</div>"
      : '<div class="alert alert-ok"><strong>Aman:</strong> belum ada kategori yang melewati anggaran bulan ini.</div>') +
    '<div class="budget-grid">' + cards + "</div>" +
    '<p class="card-note">Anggaran awal keluarga berjumlah ' + rupiah(TOTAL_BUDGET) +
    ' per bulan. Mengubah angka di sini hanya tersimpan di peramban ini.</p>';

  root.querySelectorAll("[data-budget]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = cats.find((c) => c.id === btn.getAttribute("data-budget"));
      if (!cat) return;
      const next = window.prompt("Anggaran baru (Rp) untuk " + cat.name + ":", String(cat.budget));
      if (next === null) return;
      const amount = Math.round(Number(next));
      if (Number.isFinite(amount) && amount >= 0) {
        setBudget(cat.id, amount);
        renderBudgets(root);
      }
    });
  });
}
