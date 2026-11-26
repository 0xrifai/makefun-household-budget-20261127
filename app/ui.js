// DompetKita — shared pieces every page reuses: the month switcher,
// the stat cards, one transaction row, and the page header.

import { MONTHS, labelFor } from "./data.js";
import { rupiah, tanggal, esc } from "./format.js";
import { currentMonth } from "./store.js";

// The month picker every page shows above its content.
export function monthSwitcher() {
  const cur = currentMonth();
  const buttons = MONTHS.map((m) => {
    const active = m.id === cur ? " is-active" : "";
    return (
      '<button type="button" class="month-btn' + active + '" data-month="' + m.id + '">' +
      m.label + "</button>"
    );
  }).join("\n");
  return '<div class="month-switch" role="group" aria-label="Pilih bulan">' + buttons + "</div>";
}

export function pageHead(title, sub) {
  return '<div class="page-head"><h2>' + esc(title) + '</h2><p>' + esc(sub) + "</p></div>";
}

// One stat card: label, big figure, small note underneath.
export function statCard(label, value, note, tone) {
  const cls = tone ? " stat-" + tone : "";
  return (
    '<div class="stat' + cls + '"><span class="stat-label">' + esc(label) + "</span>" +
    '<strong class="stat-value">' + esc(value) + "</strong>" +
    '<span class="stat-note">' + esc(note) + "</span></div>"
  );
}

// One transaction row for lists. Actions (edit/delete) are wired by the page.
export function txRow(tx, actions) {
  const sign = tx.kind === "in" ? "+" : "−";
  const cls = tx.kind === "in" ? "tx-in" : "tx-out";
  const amount = sign + " " + rupiah(tx.amount);
  const btns = actions
    ? '<span class="tx-actions">' +
      '<button type="button" class="mini-btn" data-edit="' + tx.id + '">Ubah</button>' +
      '<button type="button" class="mini-btn mini-danger" data-del="' + tx.id + '">Hapus</button>' +
      "</span>"
    : "";
  return (
    '<li class="tx-row ' + cls + '">' +
    '<span class="tx-dot" aria-hidden="true"></span>' +
    '<span class="tx-main"><strong>' + esc(tx.desc) + "</strong>" +
    '<small>' + tanggal(tx.date) + " · " + esc(labelFor(tx)) + "</small></span>" +
    '<span class="tx-amount">' + amount + "</span>" + btns + "</li>"
  );
}

// The "add transaction" form. Pages drop it where the flow needs it.
export function txForm(monthId) {
  const day = monthId + "-26";
  return (
    '<form class="tx-form" id="tx-form">' +
    '<h3>Catat transaksi baru</h3>' +
    '<label>Apa yang terjadi?<input name="desc" type="text" required maxlength="80" placeholder="cth. Belanja mingguan"></label>' +
    '<label>Tanggal<input name="date" type="date" required value="' + day + '" min="' + monthId + '-01" max="' + monthId + '-28"></label>' +
    '<label>Jenis<select name="kind"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>' +
    '<label>Kategori<select name="cat" id="tx-cat"></select></label>' +
    '<label>Jumlah (Rp)<input name="amount" type="number" required min="1000" step="1000" placeholder="500000"></label>' +
    '<button type="submit" class="btn-primary">Simpan transaksi</button>' +
    '<p class="form-note">Tersimpan di peramban ini saja — data contoh tetap utuh.</p>' +
    "</form>"
  );
}

// Fill the category <select> for the form, income or expense side.
export function fillCatSelect(select, kind, categories, sources) {
  const list = kind === "in" ? sources : categories;
  select.innerHTML = list.map((c) => '<option value="' + c.id + '">' + esc(c.name) + "</option>").join("");
}
