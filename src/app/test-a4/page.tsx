"use client";

import { useState } from "react";

/**
 * Test page: A4 CSS preview + print
 *
 * Tujuan: membuktikan apakah pendekatan CSS cm-based (21cm × 29.7cm)
 * menghasilkan layout yang konsisten antara tampilan browser dan hasil print.
 *
 * Cara test:
 *  1. Buka http://localhost:3000/test-a4
 *  2. Ketik teks di textarea — teks muncul di dalam "halaman" A4
 *  3. Ctrl+P / Cmd+P → pilih paper size A4 → lihat apakah layout sama
 */
export default function TestA4Page() {
  const [text, setText] = useState(
    "Ketik sesuatu di sini dan lihat bagaimana teks mengisi halaman A4.\n\nCoba tambahkan banyak teks untuk melihat apakah konten meluap keluar dari batas halaman.",
  );

  return (
    <div className="min-h-screen bg-gray-200 py-10">
      {/* ── Controls ── */}
      <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-white p-4 shadow">
        <h1 className="mb-1 text-lg font-bold">Test: A4 CSS Preview</h1>
        <p className="mb-3 text-sm text-gray-500">
          Halaman ini menguji pendekatan{" "}
          <code>width: 21cm; height: 29.7cm</code> untuk preview dokumen A4.
          Ketik teks di bawah, lalu coba print (Cmd+P) dan bandingkan hasilnya.
        </p>

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Isi dokumen
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-2 font-mono text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik teks di sini..."
        />

        <button
          className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          onClick={() => window.print()}
        >
          🖨 Print / Save as PDF
        </button>
      </div>

      {/* ── A4 Page Preview ── */}
      {/*
        Pendekatan: gunakan satuan cm langsung.
        - width: 21cm, height: 29.7cm → dimensi A4 persis
        - padding: 2cm → margin dokumen
        - overflow: hidden → konten yang melebihi tinggi halaman terpotong
          (sama seperti PDF — tidak ada scroll di dalam halaman)
        - box-shadow → efek "kertas" di layar
        - @media print → hilangkan shadow, paksa page-break
      */}
      <div
        id="a4-page"
        style={{
          width: "21cm",
          height: "29.7cm",
          margin: "0 auto",
          padding: "2cm",
          background: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          boxSizing: "border-box",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
          fontSize: "12pt",
          lineHeight: 1.6,
          color: "#111",
        }}
      >
        <h2
          style={{
            fontSize: "18pt",
            fontWeight: "bold",
            marginBottom: "0.5cm",
            borderBottom: "1px solid #ccc",
            paddingBottom: "0.3cm",
          }}
        >
          Dokumen A4 — Test Preview
        </h2>

        {/* Render teks dari textarea, baris per baris */}
        {text.split("\n").map((line, i) => (
          <p key={i} style={{ marginBottom: "0.3cm", minHeight: "1em" }}>
            {line || "\u00A0" /* non-breaking space untuk baris kosong */}
          </p>
        ))}
      </div>

      {/* ── Catatan observasi ── */}
      <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="mb-1 font-semibold">⚠ Keterbatasan pendekatan ini:</p>
        <ul className="list-disc space-y-1 pl-4">
          <li>
            <strong>Overflow terpotong</strong> — konten yang melebihi 29.7cm
            tidak terlihat. Tidak ada paginasi otomatis.
          </li>
          <li>
            <strong>DPI bergantung browser</strong> — <code>1cm</code> di CSS =
            37.8px di 96 DPI, tapi printer bisa berbeda. Hasil print bisa
            sedikit bergeser tergantung driver printer.
          </li>
          <li>
            <strong>Tidak cocok untuk konten dinamis</strong> — jika teks
            bertambah, halaman tidak otomatis bertambah. Harus implementasi
            paginasi manual.
          </li>
          <li>
            <strong>Berbeda dengan react-pdf</strong> — react-pdf menggunakan
            satuan <em>pt</em> (1pt = 1/72 inch), bukan cm. Konversi: 21cm ≈
            595pt, 29.7cm ≈ 842pt.
          </li>
        </ul>
      </div>

      {/* Print styles — injected via style tag */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #a4-page, #a4-page * {
            visibility: visible;
          }
          #a4-page {
            position: fixed;
            top: 0;
            left: 0;
            margin: 0 !important;
            box-shadow: none !important;
            /* Force A4 paper size */
            width: 21cm;
            height: 29.7cm;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
