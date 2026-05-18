"use client";

import React from "react";

import type { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

import { getTemplate } from "../templates/registry";

// Map font name → CSS font-family value
const FONT_FAMILY_MAP: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Roboto: "'Roboto', sans-serif",
  Garamond: "'EB Garamond', 'Garamond', serif",
};

// Map lineHeight key → CSS line-height value
const LINE_HEIGHT_MAP: Record<string, string> = {
  tight: "1.3",
  normal: "1.5",
  relaxed: "1.7",
};

// Map density → spacing multiplier via CSS custom property
const DENSITY_PADDING_MAP: Record<string, string> = {
  compact: "32px",
  normal: "50px",
  comfortable: "70px",
};

interface HtmlCoverLetterProps {
  data: Partial<CoverLetterBuilderData>;
}

export function HtmlCoverLetter({ data }: HtmlCoverLetterProps) {
  const templateId = data.style?.templateId;
  const template = getTemplate(templateId);
  const Template = template.Html;

  const fontFamily =
    FONT_FAMILY_MAP[data.style?.fontFamily ?? "Inter"] ?? "'Inter', sans-serif";
  const fontSize = data.style?.fontSize ?? "11px";
  const lineHeight =
    LINE_HEIGHT_MAP[data.style?.lineHeight ?? "relaxed"] ?? "1.7";

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        lineHeight,
      }}
    >
      <Template data={data} />
    </div>
  );
}
