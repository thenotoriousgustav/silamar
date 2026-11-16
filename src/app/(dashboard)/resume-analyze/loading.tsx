import { Loader2 } from "lucide-react";

export default function ResumeAnalyzeLoading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">
          Memuat analisis resume...
        </p>
      </div>
    </div>
  );
}
