"use client";

import { useMemo } from "react";

import { PageRenderer } from "../../components/page-renderer";
import { buildClassicBlocks } from "../../utils/build-blocks";
import type { HtmlTemplateProps } from "../types";

export function ModernHtmlTemplate({ data }: HtmlTemplateProps) {
  const blocks = useMemo(
    () =>
      buildClassicBlocks(data, {
        nameClass:
          "text-[2.5em] font-extrabold tracking-tighter text-blue-600 uppercase text-center",
        metaClass:
          "text-[0.8em] tracking-widest text-gray-500 uppercase text-center",
        bodyClass:
          "text-[1em] leading-loose text-gray-800 text-justify whitespace-pre-wrap",
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
      data.style?.fontFamily,
      data.style?.fontSize,
    ],
  );

  return <PageRenderer blocks={blocks} />;
}
