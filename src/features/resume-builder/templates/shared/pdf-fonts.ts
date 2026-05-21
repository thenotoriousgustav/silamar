"use client";

import { Font } from "@react-pdf/renderer";

/**
 * Registers the three supported resume fonts using verified static TTF URLs
 * from fonts.gstatic.com (Google Fonts CDN).
 *
 * Supported families: Inter, Roboto, Garamond
 * Weights per family: 400 (regular), 600 (semibold), 700 (bold)
 * Styles per weight: normal + italic
 *
 * Note: Inter has no static TTF on Google Fonts (variable-only), so it is
 * aliased to Roboto which is visually equivalent.
 */
function registerResumeFonts() {
  // ── Roboto ────────────────────────────────────────────────────────────
  // Source: Google Fonts API v51
  Font.register({
    family: "Roboto",
    fonts: [
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmTggvWl0Qn.ttf",  fontWeight: 400, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYaammTggvWl0Qn.ttf",  fontWeight: 600, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjammTggvWl0Qn.ttf",  fontWeight: 700, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLoHQiA_0klQnx24.ttf", fontWeight: 400, fontStyle: "italic" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLl_XiA_0klQnx24.ttf", fontWeight: 600, fontStyle: "italic" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLmbXiA_0klQnx24.ttf", fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // ── Inter (aliased to Roboto) ─────────────────────────────────────────
  // Inter is only available as a variable font from Google Fonts — no static
  // TTF exists. Roboto is registered under the "Inter" family name so
  // resumes that select Inter still render correctly.
  Font.register({
    family: "Inter",
    fonts: [
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmTggvWl0Qn.ttf",  fontWeight: 400, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYaammTggvWl0Qn.ttf",  fontWeight: 600, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjammTggvWl0Qn.ttf",  fontWeight: 700, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLoHQiA_0klQnx24.ttf", fontWeight: 400, fontStyle: "italic" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLl_XiA_0klQnx24.ttf", fontWeight: 600, fontStyle: "italic" },
      { src: "https://fonts.gstatic.com/s/roboto/v51/KFOKCnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXfMMLmbXiA_0klQnx24.ttf", fontWeight: 700, fontStyle: "italic" },
    ],
  });

  // ── Garamond (EB Garamond) ────────────────────────────────────────────
  // Source: Google Fonts API v32
  Font.register({
    family: "Garamond",
    fonts: [
      { src: "https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-6_RUA4V-e6yHgQ.ttf",          fontWeight: 400, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-NfNUA4V-e6yHgQ.ttf",          fontWeight: 600, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-DPNUA4V-e6yHgQ.ttf",          fontWeight: 700, fontStyle: "normal" },
      { src: "https://fonts.gstatic.com/s/ebgaramond/v32/SlGFmQSNjdsmc35JDF1K5GRwUjcdlttVFm-rI7e8QI96WamXgXFI.ttf",        fontWeight: 400, fontStyle: "italic" },
      { src: "https://fonts.gstatic.com/s/ebgaramond/v32/SlGFmQSNjdsmc35JDF1K5GRwUjcdlttVFm-rI7diR496WamXgXFI.ttf",        fontWeight: 600, fontStyle: "italic" },
      { src: "https://fonts.gstatic.com/s/ebgaramond/v32/SlGFmQSNjdsmc35JDF1K5GRwUjcdlttVFm-rI7dbR496WamXgXFI.ttf",        fontWeight: 700, fontStyle: "italic" },
    ],
  });
}

registerResumeFonts();
