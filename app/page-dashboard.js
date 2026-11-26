// DompetKita — Dashboard: the month at a glance.
// Four stat cards, a donut of spending by category, a three-month bar
// chart, the budget warnings, the goals strip, and the latest transactions.

import { FAMILY, CATEGORIES, MONTHS } from "./data.js";
import { rupiah, rupiahShort, persen, namaBulan } from "./format.js";
import { donut, monthBars } from "./charts.js";
import { monthSwitcher, pageHead, statCard, txRow } from "./ui.js";
import {
  currentMonth, monthSummary, monthByCategory, monthTransactions, goals,
} from "./store.js";

export function renderDashboard(root) {
  const m = currentMonth();
  const sum = monthSummary(m);
  const byCat = monthByCategory(m);
  const saveRate = sum.income > 0 ? sum.left / sum.income : 0;
  const over = byCat.filter((c) => c.spent > c.budget);
  const rows = monthTransactions(m).slice(0, 5);
  const goalList = goals();

  const donutSlices = byCat
    .filter((c) => c.spent > 0)
    .map((c) => ({ label: c.name, value: c.spent, color: c.color }));

  const barRows = MONTHS.map((mo) => {
    const s = monthSummary(mo.id);
    const short = mo.label.split(" ")[0].slice(0, 3);
    return { label: short, income: s.income, expense: s.expense };
  });

  const warn = over.length > 0
    ? '<div class="alert"><strong>Perhatian:</strong> ' +
      over.map((c) => c.name + " melewati anggaran " + rupiah(c.spent - c.budget)).join("; ") +
      ". Cek halaman Anggaran untuk mengaturnya.</div>"
    : '<div class="alert alert-ok"><strong>Aman:</strong> semua kategori masih di dalam anggaran bulan ini.</div>';

  const goalStrip = goalList.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return (
      '<a class="goal-chip" href="#/tujuan"><strong>' + g.name + "</strong>" +
      '<span class="goal-bar"><span style="width:' + pct + '%"></span></span>' +
      "<span>" + rupiah(g.saved) + " dari " + rupiah(g.target) + " (" + pct + "%)</span></a>"
    );
  }).join("\n");

  const legend = donutSlices.map((s) => {
    const pct = sum.expense > 0 ? Math.round((s.value / sum.expense) * 100) : 0;
    return (
      '<li><span class="swatch" style="background:' + s.color + '"></span>' +
      s.label + " — <strong>" + rupiah(s.value) + "</strong> (" + pct + "%)</li>"
    );
  }).join("\n");

  root.innerHTML =
    pageHead("Dasbor " + FAMILY.name, FAMILY.members + " · " + FAMILY.place + " · " + namaBulan(m)) +
    monthSwitcher() +
    '<div class="stat-grid">' +
    statCard("Pemasukan " + namaBulan(m), rupiah(sum.income), "Gaji Rp 9,5 jt + katering Rp 3 jt", "in") +
    statCard("Pengeluaran", rupiah(sum.expense), sum.count + " transaksi bulan ini", "out") +
    statCard("Sisa untuk ditabung", rupiah(sum.left), "Tingkat tabungan " + persen(saveRate), "left") +
    statCard("Total anggaran", rupiah(CATEGORIES.reduce((s, c) => s + c.budget, 0)), "9 kategori belanja", "") +
    "</div>" +
    warn +
    '<div class="dash-grid">' +
    '<section class="card"><h3>Ke mana uang pergi?</h3>' +
    '<div class="donut-wrap">' + donut(donutSlices, 220) +
    '<ul class="legend">' + legend + "</ul></div></section>" +
    '<section class="card"><h3>Pemasukan vs pengeluaran</h3>' + monthBars(barRows) +
    '<p class="legend-line"><span class="swatch" style="background:#15803d"></span> Pemasukan &nbsp; ' +
    '<span class="swatch" style="background:#dc2626"></span> Pengeluaran</p>' +
    '<p class="card-note">Tiga bulan terakhir: pemasukan tetap ' + rupiahShort(monthSummary(m).income) +
    ", belanja bergerak dari " + rupiahShort(monthSummary(MONTHS[0].id).expense) +
    " (" + MONTHS[0].label.split(" ")[0] + ") ke " + rupiahShort(sum.expense) + ".</p></section>" +
    "</div>" +
    '<section class="card"><h3>Tabungan keluarga</h3><div class="goal-strip">' + goalStrip + "</div></section>" +
    '<section class="card"><h3>Transaksi terbaru</h3>' +
    '<ul class="tx-list">' + rows.map((t) => txRow(t, false)).join("\n") + "</ul>" +
    '<p class="card-link"><a href="#/transaksi">Lihat semua transaksi →</a></p></section>';
}
