// DompetKita — boot and hash router.
// Five pages, each reached by a link: #/dashboard, #/transaksi,
// #/anggaran, #/tujuan, #/laporan. The month switcher re-renders the
// current page; the footer resets the family's own edits.

import { FAMILY } from "./data.js";
import { renderDashboard } from "./page-dashboard.js";
import { renderTransactions } from "./page-transactions.js";
import { renderBudgets } from "./page-budgets.js";
import { renderGoals } from "./page-goals.js";
import { renderReports } from "./page-reports.js";
import { setMonth, resetAll } from "./store.js";

const PAGES = [
  { route: "dashboard", label: "Dasbor", render: renderDashboard },
  { route: "transaksi", label: "Transaksi", render: renderTransactions },
  { route: "anggaran", label: "Anggaran", render: renderBudgets },
  { route: "tujuan", label: "Tujuan", render: renderGoals },
  { route: "laporan", label: "Laporan", render: renderReports },
];

const main = document.getElementById("app");

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const found = PAGES.find((p) => p.route === hash);
  return found ? found.route : "dashboard";
}

function renderNav(route) {
  return PAGES.map((p) => {
    const active = p.route === route ? ' aria-current="page" class="is-active"' : "";
    return '<a href="#/' + p.route + '"' + active + ">" + p.label + "</a>";
  }).join("\n");
}

function render(route) {
  const page = PAGES.find((p) => p.route === route) || PAGES[0];
  main.innerHTML = '<nav class="page-nav" aria-label="Halaman">' + renderNav(route) + "</nav>";
  const section = document.createElement("div");
  section.className = "page";
  main.appendChild(section);
  page.render(section);
  window.scrollTo(0, 0);
}

document.getElementById("brand-name").textContent = "DompetKita";
document.getElementById("brand-tag").textContent =
  "Keuangan " + FAMILY.name + " — rapi, jujur, dan bisa dibuka di HP.";

// Month buttons are rendered by the pages; one delegated listener
// handles them (and the footer reset) wherever they appear.
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-month]");
  if (btn) {
    setMonth(btn.getAttribute("data-month"));
    render(currentRoute());
  }
  if (e.target.closest("#reset-data")) {
    if (window.confirm("Kembalikan semua data ke contoh awal?")) {
      resetAll();
      render(currentRoute());
    }
  }
});

window.addEventListener("hashchange", () => render(currentRoute()));
render(currentRoute());
