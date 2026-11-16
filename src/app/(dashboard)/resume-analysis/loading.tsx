import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeAnalysisLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      {/* Upload / Selection Area */}
      <div className="glass p-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Analysis Results Placeholder */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass space-y-4 p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="glass space-y-4 p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
