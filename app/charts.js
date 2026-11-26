// DompetKita — hand-rolled SVG charts. No chart library, no network:
// every chart is a string of <svg> built from numbers the site already has.

import { rupiahShort } from "./format.js";

// Donut of spending by category.
// slices: [{label, value, color}] — zero-value slices are skipped.
export function donut(slices, size) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  let offset = 0;
  let rings = "";
  for (const s of slices) {
    if (s.value <= 0 || total <= 0) continue;
    const frac = s.value / total;
    const len = Math.max(frac * c - 2, 0.5);
    rings +=
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r +
      '" fill="none" stroke="' + s.color + '" stroke-width="26" stroke-dasharray="' +
      len.toFixed(1) + " " + (c - len).toFixed(1) +
      '" stroke-dashoffset="' + (-offset).toFixed(1) + '" />\n';
    offset += frac * c;
  }
  const hole = total > 0
    ? '<text x="50%" y="47%" text-anchor="middle" class="donut-total">' + rupiahShort(total) + '</text>' +
      '<text x="50%" y="60%" text-anchor="middle" class="donut-caption">total belanja</text>'
    : '<text x="50%" y="52%" text-anchor="middle" class="donut-caption">belum ada belanja</text>';
  return (
    '<svg class="chart-svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" role="img" aria-label="Diagram lingkaran belanja per kategori">\n' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="#e7e0d3" stroke-width="26" />\n' +
    rings + hole + "\n</svg>"
  );
}

// Vertical bars, one per month: income (green) beside spending (red).
// rows: [{label, income, expense}]
export function monthBars(rows) {
  const w = 560;
  const h = 220;
  const padTop = 26;
  const padBottom = 30;
  const max = Math.max(1, ...rows.map((r) => Math.max(r.income, r.expense)));
  const slot = w / rows.length;
  const bw = Math.min(42, slot / 3);
  let out = '<svg class="chart-svg" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Grafik batang pemasukan dan pengeluaran per bulan">\n';
  rows.forEach((row, i) => {
    const cx = slot * i + slot / 2;
    const hIn = (row.income / max) * (h - padTop - padBottom);
    const hOut = (row.expense / max) * (h - padTop - padBottom);
    const yBase = h - padBottom;
    out +=
      '<rect x="' + (cx - bw - 4).toFixed(0) + '" y="' + (yBase - hIn).toFixed(0) +
      '" width="' + bw + '" height="' + hIn.toFixed(0) + '" rx="4" fill="#15803d" />\n' +
      '<rect x="' + (cx + 4).toFixed(0) + '" y="' + (yBase - hOut).toFixed(0) +
      '" width="' + bw + '" height="' + hOut.toFixed(0) + '" rx="4" fill="#dc2626" />\n' +
      '<text x="' + (cx - bw / 2 - 4).toFixed(0) + '" y="' + (yBase - hIn - 6).toFixed(0) + '" text-anchor="middle" class="bar-value">' +
      rupiahShort(row.income) + "</text>\n" +
      '<text x="' + (cx + bw / 2 + 4).toFixed(0) + '" y="' + (yBase - hOut - 6).toFixed(0) + '" text-anchor="middle" class="bar-value">' +
      rupiahShort(row.expense) + "</text>\n" +
      '<text x="' + cx.toFixed(0) + '" y="' + (h - 10) + '" text-anchor="middle" class="bar-label">' + row.label + "</text>\n";
  });
  out += "</svg>";
  return out;
}

// Horizontal bars for category totals across all months.
// rows: [{label, value, color}] sorted big-first by the caller.
export function categoryBars(rows) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  let out = '<div class="hbar-list">\n';
  for (const r of rows) {
    const pct = Math.round((r.value / max) * 100);
    out +=
      '<div class="hbar-row"><span class="hbar-name">' + r.label + "</span>" +
      '<div class="hbar-track"><div class="hbar-fill" style="width:' + pct + "%;background:" + r.color + '"></div></div>' +
      '<span class="hbar-value">' + rupiahShort(r.value) + "</span></div>\n";
  }
  return out + "</div>";
}

// A thin progress ring for one goal: percent 0..100, drawn as an SVG circle.
export function goalRing(pct, color) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const done = (Math.min(pct, 100) / 100) * c;
  return (
    '<svg class="ring-svg" viewBox="0 0 76 76" role="img" aria-label="' + Math.round(pct) + ' persen tercapai">\n' +
    '<circle cx="38" cy="38" r="' + r + '" fill="none" stroke="#e7e0d3" stroke-width="8" />\n' +
    '<circle cx="38" cy="38" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="8" stroke-linecap="round" ' +
    'stroke-dasharray="' + done.toFixed(1) + " " + c.toFixed(1) + '" transform="rotate(-90 38 38)" />\n' +
    '<text x="38" y="42" text-anchor="middle" class="ring-text">' + Math.round(pct) + "%</text>\n</svg>"
  );
}
