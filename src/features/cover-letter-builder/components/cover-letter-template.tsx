"use client";

import React from "react";

import { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";
import { getTemplate } from "../templates/registry";

interface CoverLetterTemplateProps {
  data: Partial<CoverLetterBuilderData>;
}

export function CoverLetterTemplate({ data }: CoverLetterTemplateProps) {
  const templateId = data.style?.templateId;
  const template = getTemplate(templateId);
  const Template = template.Pdf;

  return <Template data={data} />;
}
