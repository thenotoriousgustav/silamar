---
name: SiLamar
description: Lamar Kerja Lebih Cerdas — Tactical Monospace Career Ecosystem
colors:
  background: "oklch(0.145 0 0)"
  foreground: "oklch(0.985 0 0)"
  primary: "oklch(0.922 0 0)"
  primary-foreground: "oklch(0.205 0 0)"
  card: "oklch(0.205 0 0)"
  card-foreground: "oklch(0.985 0 0)"
  muted: "oklch(0.269 0 0)"
  muted-foreground: "oklch(0.708 0 0)"
  border: "oklch(1 0 0 / 10%)"
  accent-emerald: "#10b981"
  accent-amber: "#f59e0b"
  accent-blue: "#3b82f6"
  accent-purple: "#a855f7"
typography:
  display:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  none: "0px"
  sm: "0px"
  md: "0px"
  lg: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
---

# Design System

<!-- impeccable:design-schema 1 -->

## Overview

SiLamar menggunakan bahasa visual *Tactical Obsidian Monospace*. Terinspirasi oleh antarmuka instrumen teknikal tingkat tinggi (Vercel, Linear, Teenage Engineering), desain ini memprioritaskan ketajaman hierarki informasi, densitas data yang terukur, serta presisi dokumen resmi bagi para pencari kerja.

## Colors

- **Kanvas Utama (Dark Ground):** `oklch(0.145 0 0)` — Obsidian murni memberikan kontras tinggi bagi data teks dan metriks.
- **Teks Utama:** `oklch(0.985 0 0)` — Putih optik tajam tanpa silau.
- **Teks Sekunder / Keterangan:** `oklch(0.708 0 0)` — Abu-abu netral untuk label data sekunder.
- **Garis Pembatas (Borders):** `oklch(1 0 0 / 10%)` — Hairline border struktural setebal 1px.
- **Aksen Status Fungsional:**
  - `accent-emerald` (#10b981): Skor ATS optimal, konfirmasi penawaran kerja, indikator sistem aktif.
  - `accent-amber` (#f59e0b): Peringatan kesenjangan keyword, tahap wawancara aktif.
  - `accent-blue` (#3b82f6): Status aplikasi terkirim (dilamar), draf cover letter.
  - `accent-purple` (#a855f7): Analisis evaluasi AI & telemetri.

## Typography

Tipografi didasarkan sepenuhnya pada `font-mono` (Geist Mono / JetBrains Mono) untuk memberikan kesan perkakas profesional yang presisi dan tidak basa-basi.

- **Display:** Huruf kapital tebal (*uppercase*), tracking ketat (-0.02em), proporsi tegas.
- **Label & Badges:** Ukuran kecil (10px–12px), *uppercase*, tracking renggang (0.05em–0.1em), font-weight bold.
- **Body:** Keterbacaan tinggi dengan line-height 1.6, ukuran 14px pada desktop dan 12px pada keterangan sekunder.

## Layout

- **Sistem Grid:** Grid modular berbasis 12 kolom dengan garis pemisah presisi 1px.
- **Densitas:** Kompak dan berbobot tanpa ruang kosong yang sia-sia, meniru kepadatan konsol telemetri.
- **Breakpoints:** Responsif penuh dari smartphone 360px hingga layar desktop ultra-lebar.

## Elevation & Depth

- Tidak menggunakan drop shadow lembut dekoratif yang mengambang.
- Menggunakan pembatasan elevasi berbasis **lapisan tonal (tonal layering)** dan panel kaca presisi (`.glass`: `bg-card/60 border border-border backdrop-blur-md`).

## Shapes

- **Sudut (Border Radius):** 0px (`rounded-none`). Tidak ada elemen berbentuk pil (pill) atau sudut membulat sembarangan.
- Bentuk persegi panjang arsitektural memberikan bobot visual yang solid dan mantap.

## Components

- **Tombol (Buttons):** Bidang persegi rata dengan kontras tinggi, transisi hover seketika tanpa animasi berlebihan.
- **Status Beacons:** Titik sinyal lampu kecil dengan animasi denyut (*pulse*) halus untuk status realtime.
- **Kartu Metrik (HUD Cards):** Header bergaris tipis dengan judul teknis bergaya terminal (`[TITLE // CODE]`).

## Do's and Don'ts

### Do's
- Gunakan `rounded-none` secara konsisten pada kartu, tombol, badge, dan modal.
- Pertahankan tipografi monospace pada heading dan label status.
- Gunakan warna aksen hanya untuk mengindikasikan status fungsional (bukan dekorasi acak).

### Don'ts
- Jangan menggunakan gradient warna-warni jenuh (seperti ungu/pink neon) pada teks.
- Jangan menggunakan shadow lembut berlebihan (soft blur shadows).
- Jangan mencampurkan font sans melengkung ramah anak pada konteks instrumen profesional.
