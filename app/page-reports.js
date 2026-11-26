// DompetKita — Reports page: three months side by side, the category
// totals across the whole period, and a few plain-language insights the
// site computes from the numbers (never hand-written claims).

import { MONTHS } from "./data.js";
import { rupiah, rupiahShort, persen } from "./format.js";
import { monthBars, categoryBars } from "./charts.js";
import { pageHead } from "./ui.js";
import { monthSummary, allByCategory, allTransactions } from "./store.js";

// One line under the category bars. Guards the case where the family
// deleted every Belanja Harian transaction: no crash, just a plain line.
function belanjaNote(cats, totalOut) {
  const top = cats.find((c) => c.id === "belanja");
  if (!top || top.spent <= 0) return "Belum ada belanja harian tercatat dalam tiga bulan ini.";
  const next = cats.filter((c) => c.id !== "belanja")[0];
  const times = next && next.spent > 0 ? (top.spent / next.spent).toFixed(1).replace(".", ",") : "—";
  return (
    "Belanja Harian " + rupiahShort(top.spent) + " (" + persen(top.spent / totalOut) +
    " dari semua belanja) — sekitar " + times + " kali kategori terbesar berikutnya."
  );
}

export function renderReports(root) {
  const months = MONTHS.map((mo) => {
    const s = monthSummary(mo.id);
    const short = mo.label.split(" ")[0].slice(0, 3);
    return { id: mo.id, label: short, full: mo.label, ...s };
  });
  const cats = allByCategory().filter((c) => c.spent > 0);
  const totalIn = months.reduce((s, m) => s + m.income, 0);
  const totalOut = months.reduce((s, m) => s + m.expense, 0);
  const biggest = cats[0];
  const bestMonth = months.reduce((a, b) => (b.left > a.left ? b : a), months[0]);
  const avgOut = Math.round(totalOut / months.length);

  const rows = months.map((m) => {
    return (
      "<tr><td>" + m.full + "</td><td>" + rupiah(m.income) + "</td><td>" + rupiah(m.expense) +
      "</td><td>" + rupiah(m.left) + "</td><td>" + persen(m.income > 0 ? m.left / m.income : 0) + "</td></tr>"
    );
  }).join("\n");

  const insights = [
    "Pengeluaran terbesar tiga bulan ini adalah " + biggest.name + " (" + rupiah(biggest.spent) +
    ", " + persen(biggest.spent / totalOut) + " dari semua belanja).",
    "Bulan paling hemat adalah " + bestMonth.full + " dengan sisa " + rupiah(bestMonth.left) + ".",
    "Rata-rata belanja per bulan " + rupiah(avgOut) + ", sementara pemasukan tetap " +
    rupiah(Math.round(totalIn / months.length)) + " — keluarga menabung " +
    persen((totalIn - totalOut) / totalIn) + " dari penghasilannya.",
    "Jumlah transaksi tercatat: " + allTransactions().length + " dalam tiga bulan.",
  ];

  root.innerHTML =
    pageHead("Laporan", "Tiga bulan Keluarga Santoso dalam angka: September–November 2026.") +
    '<div class="stat-grid stat-grid-3">' +
    '<div class="stat stat-in"><span class="stat-label">Total masuk (3 bln)</span><strong class="stat-value">' + rupiah(totalIn) + "</strong></div>" +
    '<div class="stat stat-out"><span class="stat-label">Total keluar (3 bln)</span><strong class="stat-value">' + rupiah(totalOut) + "</strong></div>" +
    '<div class="stat stat-left"><span class="stat-label">Total ditabung</span><strong class="stat-value">' + rupiah(totalIn - totalOut) + "</strong></div>" +
    "</div>" +
    '<section class="card"><h3>Pemasukan vs pengeluaran per bulan</h3>' +
    monthBars(months.map((m) => ({ label: m.label, income: m.income, expense: m.expense }))) +
    '<p class="legend-line"><span class="swatch" style="background:#15803d"></span> Pemasukan &nbsp; ' +
    '<span class="swatch" style="background:#dc2626"></span> Pengeluaran</p></section>' +
    '<section class="card"><h3>Belanja per kategori (3 bulan)</h3>' +
    categoryBars(cats.map((c) => ({ label: c.name, value: c.spent, color: c.color }))) +
    '<p class="card-note">' + belanjaNote(cats, totalOut) + "</p></section>" +
    '<section class="card"><h3>Ringkasan per bulan</h3>' +
    '<div class="table-wrap"><table class="report-table">' +
    "<thead><tr><th>Bulan</th><th>Masuk</th><th>Keluar</th><th>Sisa</th><th>Ditabung</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div></section>" +
    '<section class="card"><h3>Yang bisa dibaca dari angka ini</h3><ul class="insight-list">' +
    insights.map((s) => "<li>" + s + "</li>").join("\n") + "</ul></section>";
}
