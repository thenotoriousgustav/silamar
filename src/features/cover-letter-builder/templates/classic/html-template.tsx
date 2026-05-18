"use client";

import { useMemo } from "react";

import { PageRenderer } from "../../components/page-renderer";
import { buildClassicBlocks } from "../../utils/build-blocks";
import type { HtmlTemplateProps } from "../types";

export function ClassicHtmlTemplate({ data }: HtmlTemplateProps) {
  const blocks = useMemo(
    () =>
      buildClassicBlocks(data, {
        // Font sizes use `text-[1em]` so they inherit from the HtmlCoverLetter
        // wrapper which sets fontSize from data.style.fontSize.
        nameClass: "text-[2em] font-bold tracking-tight text-gray-900 uppercase text-right",
        metaClass: "text-[0.85em] leading-relaxed text-gray-500 text-right",
        bodyClass: "text-[1em] leading-loose text-gray-800 text-justify whitespace-pre-wrap",
        headingClass: "text-[1em] font-bold text-gray-900",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      data.fullName,
      data.phone,
      data.email,
      data.address,
      data.cityAndPostal,
      data.recipientName,
      data.companyName,
      data.department,
      data.recipientAddress,
      data.recipientCityAndPostal,
      data.subject,
      data.content,
      // Re-build blocks when style changes so font size is reflected
      data.style?.fontFamily,
      data.style?.fontSize,
    ],
  );

  return <PageRenderer blocks={blocks} />;
}
