import { Skeleton } from "@/components/ui/skeleton";

export default function CoverLetterBuilderLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center gap-2 border-b pb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>

        {/* Editor Content */}
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-5"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
