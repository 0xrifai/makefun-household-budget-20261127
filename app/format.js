// DompetKita — small text helpers: rupiah amounts, dates, percents.
// No dependencies; everything here is pure and deterministic.

const RUPIAH = new Intl.NumberFormat("id-ID");

// "Rp 12.500.000"
export function rupiah(n) {
  return "Rp " + RUPIAH.format(Math.round(n));
}

// Short form for chart labels: 12500000 -> "12.5 jt", 685000 -> "685 rb".
export function rupiahShort(n) {
  const v = Math.abs(n);
  if (v >= 1000000) return trimZero((n / 1000000).toFixed(1)) + " jt";
  if (v >= 1000) return trimZero((n / 1000).toFixed(1)) + " rb";
  return String(Math.round(n));
}

function trimZero(s) {
  return s.replace(/,0$/, "").replace(/\.0$/, "");
}

// "2026-11-05" -> "5 Nov 2026"
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function tanggal(iso) {
  const parts = iso.split("-");
  const day = parseInt(parts[2], 10);
  const month = BULAN[parseInt(parts[1], 10) - 1];
  return day + " " + month + " " + parts[0];
}

// "2026-11" -> "November 2026"
const BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function namaBulan(monthId) {
  const parts = monthId.split("-");
  return BULAN_PANJANG[parseInt(parts[1], 10) - 1] + " " + parts[0];
}

// 0.583 -> "58%"
export function persen(ratio) {
  return Math.round(ratio * 100) + "%";
}

// Clamp a ratio to 0..1 for progress bars.
export function clamp01(x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

// Escape text that came from a form before it goes into innerHTML.
export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
