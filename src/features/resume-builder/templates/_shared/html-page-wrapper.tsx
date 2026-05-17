"use client";

import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface HtmlPageWrapperProps {
  pages: ReactNode[][];
  /**
   * Tailwind classes applied to the outermost container (font + layout).
   * Templates pass their `fontClass` here.
   */
  containerClass?: string;
}

/**
 * Renders an array of paginated nodes as discrete A4/Letter sized pages with
 * a page-number footer. Used by every template's HTML preview.
 */
export function HtmlPageWrapper({
  pages,
  containerClass,
}: HtmlPageWrapperProps) {
  return (
    <div
      className={cn("flex flex-col items-center gap-10 pb-10", containerClass)}
    >
      {pages.map((pageContent, idx) => (
        <div
          key={idx}
          className="hover:shadow-primary/5 relative min-h-280.75 w-198.5 bg-white p-12.5 text-slate-900 shadow-2xl transition-all"
        >
          <div className="relative z-10 h-full w-full">
            {pageContent.map((node, nodeIdx) => (
              <Fragment key={nodeIdx}>{node}</Fragment>
            ))}
          </div>
          <div className="absolute right-0 bottom-6 left-0 flex items-center justify-center">
          </div>
        </div>
      ))}
    </div>
  );
}
