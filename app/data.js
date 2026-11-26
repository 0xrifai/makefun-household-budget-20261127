// DompetKita — seed data for Keluarga Santoso (Bandung).
// Every figure on the site comes from this file: 36 transactions across
// September–November 2026, 9 budget categories and 4 savings goals.
// Amounts are whole rupiah. Income is the same every month on purpose:
// a salary of Rp 9.500.000 plus Rp 3.000.000 from the catering side job.

export const FAMILY = {
  name: "Keluarga Santoso",
  place: "Bandung",
  members: "Ayah, Ibu, dan dua anak",
  note: "Satu gaji, satu usaha katering, empat tabungan yang dikejar bersama.",
};

export const MONTHS = [
  { id: "2026-09", label: "September 2026" },
  { id: "2026-10", label: "Oktober 2026" },
  { id: "2026-11", label: "November 2026" },
];

export const DEFAULT_MONTH = "2026-11";

export const INCOME_SOURCES = [
  { id: "gaji", name: "Gaji Bulanan" },
  { id: "usaha", name: "Usaha Katering" },
];

export const CATEGORIES = [
  { id: "belanja", name: "Belanja Harian", budget: 2500000, color: "#15803d" },
  { id: "makan", name: "Makan di Luar", budget: 800000, color: "#ea580c" },
  { id: "transport", name: "Transportasi", budget: 1200000, color: "#0284c7" },
  { id: "tagihan", name: "Tagihan & Utilitas", budget: 1500000, color: "#7c3aed" },
  { id: "pendidikan", name: "Pendidikan Anak", budget: 1000000, color: "#db2777" },
  { id: "kesehatan", name: "Kesehatan", budget: 600000, color: "#dc2626" },
  { id: "hiburan", name: "Hiburan", budget: 500000, color: "#b45309" },
  { id: "pakaian", name: "Pakaian", budget: 400000, color: "#0d9488" },
  { id: "lain", name: "Lainnya", budget: 500000, color: "#64748b" },
];

export const TOTAL_BUDGET = CATEGORIES.reduce((sum, c) => sum + c.budget, 0);

export const GOALS = [
  { id: "darurat", name: "Dana Darurat", target: 10000000, saved: 6250000, note: "Enam bulan biaya hidup, untuk jaga-jaga." },
  { id: "liburan", name: "Liburan ke Yogyakarta", target: 5000000, saved: 2750000, note: "Kereta, hotel, dan jajan tiga hari." },
  { id: "laptop", name: "Laptop untuk Anak", target: 7500000, saved: 3000000, note: "Untuk tugas sekolah dan belajar coding." },
  { id: "dapur", name: "Renovasi Dapur", target: 12000000, saved: 1800000, note: "Ganti kompor, rak, dan meja makan." },
];

// kind: "in" for money coming in, "out" for money going out.
// cat: an income source id when kind is "in", a category id when "out".
export const TRANSACTIONS = [
  // ---- September 2026 ----
  { id: "t01", date: "2026-09-01", desc: "Gaji bulanan Ayah", kind: "in", cat: "gaji", amount: 9500000 },
  { id: "t02", date: "2026-09-02", desc: "Belanja mingguan di Super Indo", kind: "out", cat: "belanja", amount: 685000 },
  { id: "t03", date: "2026-09-04", desc: "Bensin Pertalite motor", kind: "out", cat: "transport", amount: 150000 },
  { id: "t04", date: "2026-09-05", desc: "Token listrik PLN", kind: "out", cat: "tagihan", amount: 420000 },
  { id: "t05", date: "2026-09-07", desc: "Makan malam keluarga di restoran", kind: "out", cat: "makan", amount: 285000 },
  { id: "t06", date: "2026-09-09", desc: "SPP sekolah anak", kind: "out", cat: "pendidikan", amount: 650000 },
  { id: "t07", date: "2026-09-12", desc: "Belanja mingguan di pasar", kind: "out", cat: "belanja", amount: 720000 },
  { id: "t08", date: "2026-09-15", desc: "Pesanan katering Bu Ratna", kind: "in", cat: "usaha", amount: 3000000 },
  { id: "t09", date: "2026-09-15", desc: "Internet IndiHome", kind: "out", cat: "tagihan", amount: 350000 },
  { id: "t10", date: "2026-09-18", desc: "Obat dan vitamin di apotek", kind: "out", cat: "kesehatan", amount: 185000 },
  { id: "t11", date: "2026-09-21", desc: "Nonton bioskop bersama anak", kind: "out", cat: "hiburan", amount: 240000 },
  { id: "t12", date: "2026-09-25", desc: "Belanja mingguan", kind: "out", cat: "belanja", amount: 640000 },
  // ---- Oktober 2026 ----
  { id: "t13", date: "2026-10-01", desc: "Gaji bulanan Ayah", kind: "in", cat: "gaji", amount: 9500000 },
  { id: "t14", date: "2026-10-01", desc: "Belanja bulanan", kind: "out", cat: "belanja", amount: 1150000 },
  { id: "t15", date: "2026-10-03", desc: "Servis motor berkala", kind: "out", cat: "transport", amount: 320000 },
  { id: "t16", date: "2026-10-06", desc: "Air PDAM", kind: "out", cat: "tagihan", amount: 180000 },
  { id: "t17", date: "2026-10-08", desc: "Token listrik PLN", kind: "out", cat: "tagihan", amount: 445000 },
  { id: "t18", date: "2026-10-10", desc: "Buku dan alat tulis anak", kind: "out", cat: "pendidikan", amount: 380000 },
  { id: "t19", date: "2026-10-13", desc: "Belanja mingguan", kind: "out", cat: "belanja", amount: 695000 },
  { id: "t20", date: "2026-10-15", desc: "Pesanan katering kantor", kind: "in", cat: "usaha", amount: 3000000 },
  { id: "t21", date: "2026-10-16", desc: "Makan siang di luar", kind: "out", cat: "makan", amount: 310000 },
  { id: "t22", date: "2026-10-19", desc: "Internet IndiHome", kind: "out", cat: "tagihan", amount: 350000 },
  { id: "t23", date: "2026-10-22", desc: "Seragam dan baju sekolah", kind: "out", cat: "pakaian", amount: 425000 },
  { id: "t24", date: "2026-10-27", desc: "Belanja mingguan", kind: "out", cat: "belanja", amount: 710000 },
  // ---- November 2026 ----
  { id: "t25", date: "2026-11-01", desc: "Gaji bulanan Ayah", kind: "in", cat: "gaji", amount: 9500000 },
  { id: "t26", date: "2026-11-01", desc: "Belanja bulanan", kind: "out", cat: "belanja", amount: 1240000 },
  { id: "t27", date: "2026-11-03", desc: "Token listrik PLN", kind: "out", cat: "tagihan", amount: 468000 },
  { id: "t28", date: "2026-11-05", desc: "Les piano anak", kind: "out", cat: "pendidikan", amount: 500000 },
  { id: "t29", date: "2026-11-08", desc: "Makan malam di restoran", kind: "out", cat: "makan", amount: 340000 },
  { id: "t30", date: "2026-11-11", desc: "Bensin dan tol", kind: "out", cat: "transport", amount: 275000 },
  { id: "t31", date: "2026-11-14", desc: "Belanja mingguan", kind: "out", cat: "belanja", amount: 745000 },
  { id: "t32", date: "2026-11-15", desc: "Pesanan katering arisan", kind: "in", cat: "usaha", amount: 3000000 },
  { id: "t33", date: "2026-11-17", desc: "Internet IndiHome", kind: "out", cat: "tagihan", amount: 350000 },
  { id: "t34", date: "2026-11-20", desc: "Periksa gigi anak", kind: "out", cat: "kesehatan", amount: 450000 },
  { id: "t35", date: "2026-11-23", desc: "Belanja mingguan", kind: "out", cat: "belanja", amount: 690000 },
  { id: "t36", date: "2026-11-25", desc: "Langganan streaming film", kind: "out", cat: "hiburan", amount: 149000 },
];

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

export function incomeSourceById(id) {
  return INCOME_SOURCES.find((s) => s.id === id) || null;
}

export function labelFor(tx) {
  if (tx.kind === "in") {
    const src = incomeSourceById(tx.cat);
    return src ? src.name : "Pemasukan";
  }
  const cat = categoryById(tx.cat);
  return cat ? cat.name : "Pengeluaran";
}
