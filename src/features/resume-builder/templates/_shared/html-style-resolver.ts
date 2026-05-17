import { cn } from "@/lib/utils";
import type { ResumeStyle } from "@/types/resume";

import { FONT_CLASS_MAP, LINE_HEIGHT_CLASS_MAP } from "./constants";

/**
 * Resolves a `ResumeStyle` into the Tailwind class strings that the HTML
 * preview templates need. Centralizing this keeps every template using the
 * same legacy-font fallback logic and same line-height tokens.
 */
export function resolveHtmlStyle(style: ResumeStyle | undefined) {
  const fontFamily = style?.fontFamily ?? "Inter";
  const fontSize = style?.fontSize ?? "text-[11px]";
  const lineHeightKey = style?.lineHeight ?? "relaxed";

  const fontClass = FONT_CLASS_MAP[fontFamily] ?? "font-resume-inter";
  const lineHeightClass =
    LINE_HEIGHT_CLASS_MAP[lineHeightKey] ?? "leading-relaxed";

  const bodyTextClass = cn(fontSize, lineHeightClass, "text-slate-700");
  const headingTextClass = cn(fontSize, "font-bold");

  return {
    fontClass,
    fontSize,
    lineHeightClass,
    bodyTextClass,
    headingTextClass,
  };
}
