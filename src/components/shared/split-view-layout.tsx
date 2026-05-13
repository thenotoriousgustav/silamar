"use client";

import { clsx } from "clsx";

type ViewMode = "split" | "form" | "preview";

interface SplitViewLayoutProps {
  viewMode: ViewMode;
  formPanel: React.ReactNode;
  previewPanel: React.ReactNode;
}

/**
 * Shared split-view layout used by document builders (resume, cover letter).
 * Handles responsive form/preview/split view transitions with consistent styling.
 */
export function SplitViewLayout({
  viewMode,
  formPanel,
  previewPanel,
}: SplitViewLayoutProps) {
  return (
    <div className="relative -m-6 flex h-[calc(100vh-64px)] flex-col overflow-hidden lg:-m-8">
      <main className="flex flex-1 overflow-hidden">
        {/* Left Side: Form */}
        <div
          className={clsx(
            "border-border bg-background h-full border-r transition-all duration-500 ease-in-out",
            viewMode === "form"
              ? "w-full"
              : viewMode === "split"
                ? "w-5/10"
                : "pointer-events-none w-0 overflow-hidden opacity-0",
          )}
        >
          {formPanel}
        </div>

        {/* Right Side: Preview */}
        <div
          className={clsx(
            "flex h-full flex-col items-center overflow-hidden transition-all duration-500 ease-in-out",
            viewMode === "preview"
              ? "w-full"
              : viewMode === "split"
                ? "w-5/10"
                : "pointer-events-none w-0 overflow-hidden opacity-0",
          )}
        >
          <div className="flex h-full w-full items-center justify-center p-4 lg:p-8">
            {previewPanel}
          </div>
        </div>
      </main>
    </div>
  );
}
