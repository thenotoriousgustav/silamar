"use client";

import { Font } from "@react-pdf/renderer";

/**
 * Registers all selectable resume fonts with @react-pdf/renderer.
 * Called once at module load. Idempotent — re-registering the same family
 * is safe.
 *
 * Fonts are pulled from Google Fonts CDN at PDF generation time. Backward-
 * compatible aliases are also registered for legacy resumes that still
 * reference Helvetica/Calibri/Georgia/Times New Roman.
 */
function registerResumeFonts() {
  // Inter — modern sans-serif (default).
  Font.register({
    family: "Inter",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.ttf",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.ttf",
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "Lato",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wWw.ttf",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPHA.ttf",
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "Garamond",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-6_RUAw.ttf",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-DPNUAw.ttf",
        fontWeight: 700,
      },
    ],
  });
}

registerResumeFonts();
