"use client";

import { Font } from "@react-pdf/renderer";

/**
 * Registers all resume fonts with @react-pdf/renderer using locally bundled
 * font files from /public/fonts/. This avoids CDN fetch failures at PDF
 * generation time.
 *
 * Variable fonts are used where available — @react-pdf/renderer supports
 * variable fonts via the standard TTF format.
 *
 * Lato is not available locally, so it falls back to Inter (same sans-serif
 * character). Legacy aliases (Helvetica, Calibri, etc.) are also mapped.
 */
function registerResumeFonts() {
  // ── Inter ────────────────────────────────────────────────────────────
  Font.register({
    family: "Inter",
    fonts: [
      {
        src: "/fonts/Inter-VariableFont_opsz,wght.ttf",
        fontWeight: 400,
      },
      {
        src: "/fonts/Inter-VariableFont_opsz,wght.ttf",
        fontWeight: 700,
      },
      {
        src: "/fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: "/fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });

  // ── Roboto ───────────────────────────────────────────────────────────
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "/fonts/Roboto-VariableFont_wdth,wght.ttf",
        fontWeight: 400,
      },
      {
        src: "/fonts/Roboto-VariableFont_wdth,wght.ttf",
        fontWeight: 700,
      },
      {
        src: "/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: "/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });

  // ── EB Garamond ──────────────────────────────────────────────────────
  Font.register({
    family: "Garamond",
    fonts: [
      {
        src: "/fonts/EBGaramond-VariableFont_wght.ttf",
        fontWeight: 400,
      },
      {
        src: "/fonts/EBGaramond-VariableFont_wght.ttf",
        fontWeight: 700,
      },
      {
        src: "/fonts/EBGaramond-Italic-VariableFont_wght.ttf",
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: "/fonts/EBGaramond-Italic-VariableFont_wght.ttf",
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });

  // ── Legacy aliases ───────────────────────────────────────────────────
  // Old resumes may reference these names — map to the closest available font.
  Font.register({
    family: "Helvetica",
    fonts: [
      { src: "/fonts/Inter-VariableFont_opsz,wght.ttf", fontWeight: 400 },
      { src: "/fonts/Inter-VariableFont_opsz,wght.ttf", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "Calibri",
    fonts: [
      { src: "/fonts/Inter-VariableFont_opsz,wght.ttf", fontWeight: 400 },
      { src: "/fonts/Inter-VariableFont_opsz,wght.ttf", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "Times New Roman",
    fonts: [
      { src: "/fonts/EBGaramond-VariableFont_wght.ttf", fontWeight: 400 },
      { src: "/fonts/EBGaramond-VariableFont_wght.ttf", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "Georgia",
    fonts: [
      { src: "/fonts/EBGaramond-VariableFont_wght.ttf", fontWeight: 400 },
      { src: "/fonts/EBGaramond-VariableFont_wght.ttf", fontWeight: 700 },
    ],
  });
}

registerResumeFonts();
