// DompetKita — Transactions page: every transaction of the chosen month,
// with a type filter, a category filter, a text search, and the add /
// edit / delete controls. All edits are stored in the browser only.

import { CATEGORIES, INCOME_SOURCES } from "./data.js";
import { rupiah, esc } from "./format.js";
import { monthSwitcher, pageHead, txForm, txRow, fillCatSelect } from "./ui.js";
import {
  currentMonth, monthTransactions, monthSummary,
  addTransaction, updateTransaction, deleteTransaction,
} from "./store.js";

let filterKind = "all";
let filterCat = "all";
let query = "";

export function renderTransactions(root) {
  const m = currentMonth();
  const sum = monthSummary(m);
  const rows = monthTransactions(m).filter((t) => {
    if (filterKind !== "all" && t.kind !== filterKind) return false;
    if (filterCat !== "all" && t.cat !== filterCat) return false;
    if (query && !t.desc.toLowerCase().includes(query)) return false;
    return true;
  });

  const catOptions = '<option value="all">Semua kategori</option>' +
    CATEGORIES.map((c) => '<option value="' + c.id + '"' + (filterCat === c.id ? " selected" : "") + ">" + esc(c.name) + "</option>").join("") +
    INCOME_SOURCES.map((s) => '<option value="' + s.id + '"' + (filterCat === s.id ? " selected" : "") + ">" + esc(s.name) + "</option>").join("");

  root.innerHTML =
    pageHead("Transaksi", "Semua uang masuk dan keluar — saring, cari, ubah, atau hapus.") +
    monthSwitcher() +
    '<div class="stat-grid stat-grid-3">' +
    '<div class="stat stat-in"><span class="stat-label">Masuk</span><strong class="stat-value">' + rupiah(sum.income) + "</strong></div>" +
    '<div class="stat stat-out"><span class="stat-label">Keluar</span><strong class="stat-value">' + rupiah(sum.expense) + "</strong></div>" +
    '<div class="stat stat-left"><span class="stat-label">Sisa</span><strong class="stat-value">' + rupiah(sum.left) + "</strong></div>" +
    "</div>" +
    '<div class="filters">' +
    '<label>Jenis <select id="f-kind">' +
    '<option value="all"' + (filterKind === "all" ? " selected" : "") + ">Semua</option>" +
    '<option value="in"' + (filterKind === "in" ? " selected" : "") + ">Pemasukan</option>" +
    '<option value="out"' + (filterKind === "out" ? " selected" : "") + ">Pengeluaran</option>" +
    "</select></label>" +
    "<label>Kategori <select id=\"f-cat\">" + catOptions + "</select></label>" +
    '<label>Cari <input id="f-q" type="search" placeholder="cth. listrik" value="' + esc(query) + '"></label>' +
    "</div>" +
    '<p class="count-line">Menampilkan <strong>' + rows.length + "</strong> dari " + sum.count + " transaksi.</p>" +
    (rows.length
      ? '<ul class="tx-list">' + rows.map((t) => txRow(t, true)).join("\n") + "</ul>"
      : '<p class="empty">Tidak ada transaksi yang cocok. Ubah saringan atau catat yang baru di bawah.</p>') +
    txForm(m);

  root.querySelector("#f-kind").addEventListener("change", (e) => {
    filterKind = e.target.value;
    renderTransactions(root);
  });
  root.querySelector("#f-cat").addEventListener("change", (e) => {
    filterCat = e.target.value;
    renderTransactions(root);
  });
  root.querySelector("#f-q").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    renderTransactions(root);
    // Re-rendering rebuilds the input, so hand the caret back to it.
    const q = root.querySelector("#f-q");
    q.focus();
    q.setSelectionRange(q.value.length, q.value.length);
  });

  const form = root.querySelector("#tx-form");
  const kindSel = form.querySelector('[name="kind"]');
  const catSel = form.querySelector("#tx-cat");
  const paintCats = () => fillCatSelect(catSel, kindSel.value, CATEGORIES, INCOME_SOURCES);
  paintCats();
  kindSel.addEventListener("change", paintCats);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    addTransaction({
      date: String(data.get("date")),
      desc: String(data.get("desc")).trim(),
      kind: String(data.get("kind")),
      cat: String(data.get("cat")),
      amount: Math.round(Number(data.get("amount"))),
    });
    renderTransactions(root);
    root.querySelector(".tx-form").scrollIntoView();
  });

  root.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.confirm("Hapus transaksi ini?")) {
        deleteTransaction(btn.getAttribute("data-del"));
        renderTransactions(root);
      }
    });
  });
  root.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = monthTransactions(m).find((t) => t.id === btn.getAttribute("data-edit"));
      if (!row) return;
      const next = window.prompt("Ubah jumlah (Rp) untuk “" + row.desc + "”:", String(row.amount));
      if (next === null) return;
      const amount = Math.round(Number(next));
      if (Number.isFinite(amount) && amount > 0) {
        updateTransaction(row.id, { amount });
        renderTransactions(root);
      }
    });
  });
}
