import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeBuilderLoading() {
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

      {/* Editor + Preview Split */}
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
        {/* Editor Panel */}
        <div className="space-y-4 overflow-hidden">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:block">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
