"use client";

import { Font } from "@react-pdf/renderer";

/**
 * Registers resume fonts with @react-pdf/renderer using STATIC weight TTF
 * files from /public/fonts/.
 *
 * Variable fonts (.ttf with wght axis) do NOT work in @react-pdf/renderer —
 * the PDF spec does not support OpenType variable font axes, so bold/italic
 * variants must be registered as separate static font files.
 *
 * Files used:
 *   Inter-Regular.ttf, Inter-Bold.ttf, Inter-Italic.ttf, Inter-BoldItalic.ttf
 *   Roboto-Regular.ttf, Roboto-Bold.ttf, Roboto-Italic.ttf, Roboto-BoldItalic.ttf
 *   EBGaramond-Regular.ttf, EBGaramond-Bold.ttf, EBGaramond-Italic.ttf, EBGaramond-BoldItalic.ttf
 */
function registerResumeFonts() {
  // ── Inter ────────────────────────────────────────────────────────────
  Font.register({
    family: "Inter",
    fonts: [
      { src: "/fonts/Inter-Regular.ttf",     fontWeight: 400, fontStyle: "normal" },
      { src: "/fonts/Inter-Bold.ttf",        fontWeight: 700, fontStyle: "normal" },
      { src: "/fonts/Inter-Italic.ttf",      fontWeight: 400, fontStyle: "italic" },
      { src: "/fonts/Inter-BoldItalic.ttf",  fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // ── Roboto ───────────────────────────────────────────────────────────
  Font.register({
    family: "Roboto",
    fonts: [
      { src: "/fonts/Roboto-Regular.ttf",     fontWeight: 400, fontStyle: "normal" },
      { src: "/fonts/Roboto-Bold.ttf",        fontWeight: 700, fontStyle: "normal" },
      { src: "/fonts/Roboto-Italic.ttf",      fontWeight: 400, fontStyle: "italic" },
      { src: "/fonts/Roboto-BoldItalic.ttf",  fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // ── EB Garamond ──────────────────────────────────────────────────────
  Font.register({
    family: "Garamond",
    fonts: [
      { src: "/fonts/EBGaramond-Regular.ttf",     fontWeight: 400, fontStyle: "normal" },
      { src: "/fonts/EBGaramond-Bold.ttf",        fontWeight: 700, fontStyle: "normal" },
      { src: "/fonts/EBGaramond-Italic.ttf",      fontWeight: 400, fontStyle: "italic" },
      { src: "/fonts/EBGaramond-BoldItalic.ttf",  fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // ── Legacy aliases ───────────────────────────────────────────────────
  // Old resumes may reference these names — map to the closest available font.
  Font.register({
    family: "Helvetica",
    fonts: [
      { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/Inter-Bold.ttf",    fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Calibri",
    fonts: [
      { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/Inter-Bold.ttf",    fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Times New Roman",
    fonts: [
      { src: "/fonts/EBGaramond-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/EBGaramond-Bold.ttf",    fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Georgia",
    fonts: [
      { src: "/fonts/EBGaramond-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/EBGaramond-Bold.ttf",    fontWeight: 700 },
    ],
  });
}

registerResumeFonts();
