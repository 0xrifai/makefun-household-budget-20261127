[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/0xrifai/makefun-household-budget-20261127/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/0xrifai/makefun-household-budget-20261127/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

# DompetKita — Keuangan Keluarga Santoso

DompetKita is a household budget site for Keluarga Santoso of Bandung: one
salary, one catering side business, and four savings goals chased together.
It runs entirely from static files — no build step, no network requests —
on a desktop and on a phone.

## What it shows

- **Dasbor** — the month at a glance: income, spending, what is left to save,
  a donut of spending by category, a three-month income-vs-spending chart,
  budget warnings, goal progress, and the latest transactions.
- **Transaksi** — all 36 seed transactions (September–November 2026), with
  filters by type and category, text search, and working add / edit / delete.
- **Anggaran** — 9 budget categories (Rp 9.000.000/month in total), each with
  a progress bar, spent-vs-cap figures, and an editable cap.
- **Tujuan** — 4 savings goals (Dana Darurat, Liburan ke Yogyakarta, Laptop
  untuk Anak, Renovasi Dapur) with progress rings and working top-ups.
- **Laporan** — three months side by side, category totals, and insights the
  site computes from the numbers.

Real figures throughout: income Rp 12.500.000/month (salary Rp 9.500.000 +
catering Rp 3.000.000). In November 2026 the family spent Rp 5.207.000 and
kept Rp 7.293.000. A month switcher re-computes every page. Edits are kept
in the browser only (localStorage); a reset link in the footer restores the
seed data.

## Run it

Serve `app/` with any static server, then open it in a browser:

```sh
cd app && python3 -m http.server 8080
# open http://localhost:8080
```

## Layout

- `app/index.html` — page shell: header, mount point, footer.
- `app/app.js` — boot and hash router (`#/dashboard`, `#/transaksi`,
  `#/anggaran`, `#/tujuan`, `#/laporan`).
- `app/data.js` — the seed data: family, months, categories, goals, 36 transactions.
- `app/store.js` — state: seed data plus the family's edits, and monthly totals.
- `app/format.js` — rupiah amounts, dates, percents.
- `app/charts.js` — hand-rolled SVG charts (donut, bars, goal rings).
- `app/ui.js` — shared pieces: month switcher, stat cards, transaction rows.
- `app/page-dashboard.js`, `app/page-transactions.js`, `app/page-budgets.js`,
  `app/page-goals.js`, `app/page-reports.js` — one file per page.
- `app/style.css` — all styling, including the phone layout.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to
  `/output`, writes `dossier.json` with the vendored make.fun library, and
  writes the plain-text summary to the absolute path `/output/entry.txt`.
- `vendor/makefun-frontend.ts` — the kit's library, unchanged.
- `screenshots/` — four real renders of the site in headless Chromium.

## Screenshots

Four real renders of the site in headless Chromium, in `screenshots/`:

1. `1-dashboard.png` — the dashboard at 1280×860 (cover).
2. `2-transactions.png` — the transactions page at 1280×860.
3. `3-reports.png` — the reports page at 1280×860.
4. `4-phone.png` — the dashboard on a phone at 390×844.

## Entry

Built for the make.fun bounty [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457)
(`best-household-budget-site-20261126-1457`).
