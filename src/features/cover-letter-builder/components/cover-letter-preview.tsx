"use client";

import { Braces, Check, Copy, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

const PdfPreview = dynamic(() => import("./pdf-preview").then((m) => ({ default: m.PdfPreview })), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="bg-muted h-[600px] w-[420px] animate-pulse rounded-lg" />
    </div>
  ),
});

interface CoverLetterPreviewProps {
  content: Partial<CoverLetterBuilderData>;
}

type ViewMode = "pdf" | "json";

export function CoverLetterPreview({ content }: CoverLetterPreviewProps) {
  const [mode, setMode] = useState<ViewMode>("pdf");
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
          {mode === "json" ? (
            <Braces className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {mode === "json"
            ? "Cover Letter Data (JSON)"
            : "Cover Letter Preview (Exact)"}
        </h2>

        <div className="flex items-center gap-4">
          {/* Mode switcher */}
          <div className="bg-muted/50 border-border/50 flex items-center rounded-lg border p-1">
            <Button
              variant={mode === "pdf" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-[10px] font-bold uppercase"
              onClick={() => setMode("pdf")}
              title="Pixel-perfect PDF preview — identical to downloaded file"
            >
              PDF
            </Button>
            <Button
              variant={mode === "json" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-[10px] font-bold uppercase"
              onClick={() => setMode("json")}
            >
              JSON
            </Button>
          </div>

          {mode === "json" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyJson}
              className="h-8 gap-2"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="text-xs">Copy JSON</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      {mode === "pdf" ? (
        <div className="flex-1 overflow-hidden">
          <PdfPreview content={content} />
        </div>
      ) : (
        <div className="bg-muted/30 border-border/50 relative flex-1 overflow-auto border shadow-sm">
          <div className="flex h-full w-full flex-col p-6">
            <div className="relative h-full w-full overflow-hidden rounded-none border border-slate-800 bg-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                  <span className="ml-2 text-[10px] font-medium tracking-tight text-slate-400">
                    cover_letter_data.json
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {JSON.stringify(content).length} bytes
                </span>
              </div>
              <div className="custom-scrollbar h-[calc(100%-40px)] overflow-auto p-6 font-mono text-xs leading-relaxed text-slate-300">
                <pre className="break-all whitespace-pre-wrap">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950 to-transparent opacity-50" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
