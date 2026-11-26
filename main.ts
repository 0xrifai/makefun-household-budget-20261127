// DompetKita — the hand-in program (Node 22, standard library only).
//
// It hands the site in: copies app/ and screenshots/ from beside this file
// into the output directory, writes the judge's dossier.json with the
// vendored make.fun library, and writes a plain-text entry summary.
//
// The summary matters: the grader runs this program in a container where
// the repository is read-only and only /output is writable, so the summary
// goes to the ABSOLUTE path /output/entry.txt — never to a relative path.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output for the
// site and dossier, while the summary is still written to /output too,
// so a local run proves the exact file the grader needs will exist.
//
// Run it locally like this:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// A short plain-text summary of the entry. Fixed wording and figures:
// nothing here depends on the clock, so two runs write identical bytes.
const ENTRY_SUMMARY = [
  "DompetKita — situs anggaran rumah tangga Keluarga Santoso (Bandung)",
  "",
  "Pemasukan Rp 12.500.000/bulan: gaji Rp 9.500.000 + usaha katering Rp 3.000.000.",
  "November 2026: pengeluaran Rp 5.207.000, sisa untuk ditabung Rp 7.293.000.",
  "Tiga bulan (Sep-Nov 2026): pemasukan Rp 37.500.000, pengeluaran Rp 14.497.000.",
  "",
  "Isi situs: 36 transaksi, 9 kategori anggaran (total Rp 9.000.000/bulan),",
  "4 tujuan menabung, 5 halaman: Dasbor, Transaksi, Anggaran, Tujuan, Laporan.",
  "Semua angka dihitung dari data situs; grafik SVG digambar tangan tanpa pustaka.",
  "File statis di app/, tanpa permintaan jaringan, bisa dibuka di desktop dan HP.",
  "",
  "Tangkapan layar: 1-dashboard.png (sampul), 2-transactions.png,",
  "3-reports.png, 4-phone.png (tampilan HP 390x844).",
].join("\n") + "\n";

function copySite() {
  mkdirSync(outDir, { recursive: true });
  cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
  mkdirSync(join(outDir, "screenshots"), { recursive: true });
  if (existsSync(join(repoRoot, "screenshots"))) {
    cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true });
  }
}

function writeDossier() {
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(outDir, "dossier.json"), dossier);
  return dossier;
}

function writeEntrySummary(dossierBytes) {
  const text =
    ENTRY_SUMMARY +
    "\nDossier: " + dossierBytes + " bytes (dossier.json, dibuat dari app/ dan screenshots/).\n";
  // The output directory (or its MAKEFUN_OUTPUT_DIR stand-in) first…
  writeFileSync(join(outDir, "entry.txt"), text);
  // …and always the absolute /output/entry.txt the grader reads.
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", text);
}

copySite();
const dossier = writeDossier();
writeEntrySummary(Buffer.byteLength(dossier, "utf8"));

// A quiet confirmation for a human running it by hand; the grader only
// cares about the files. Keep it off the dossier: it goes to stdout.
console.log("DompetKita handed in: app/ + screenshots/ + dossier.json + entry.txt -> " + outDir);
