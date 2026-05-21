"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";

import {
  PAGE_HEIGHT,
  PAGE_PADDING_X,
  PAGE_PADDING_Y,
  PAGE_WIDTH,
} from "./pagination-engine";

interface A4PageProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A single A4-sized page in the cover letter preview.
 * Memoized to prevent unnecessary re-renders when other pages change.
 */
export const A4Page = memo(function A4Page({
  children,
  className,
}: A4PageProps) {
  return (
    <div
      className={cn("relative shrink-0 bg-white shadow-2xl", className)}
      style={{
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        paddingTop: PAGE_PADDING_Y,
        paddingBottom: PAGE_PADDING_Y,
        paddingLeft: PAGE_PADDING_X,
        paddingRight: PAGE_PADDING_X,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
});
