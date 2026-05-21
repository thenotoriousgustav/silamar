"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically imported Lexical Editor component.
 * Use this instead of importing directly from `./rich-text-editor`
 * to keep the heavy Lexical bundle out of the initial page load.
 */
export const DynamicEditor = dynamic(
  () => import("./rich-text-editor").then((mod) => ({ default: mod.Editor })),
  {
    loading: () => (
      <div className="bg-muted/50 border-border h-32 w-full animate-pulse rounded-md border" />
    ),
    ssr: false,
  },
);
