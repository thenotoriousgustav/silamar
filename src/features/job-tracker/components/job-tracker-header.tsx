"use client";

import { Kanban as KanbanIcon, Link2, Plus, Table2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { PageHeader } from "@/shared/page-header";

interface JobTrackerHeaderProps {
  view: "kanban" | "table";
  onViewChange: (view: "kanban" | "table") => void;
  onAddClick: () => void;
  onLinkedInImportClick: () => void;
}

export function JobTrackerHeader({
  view,
  onViewChange,
  onAddClick,
  onLinkedInImportClick,
}: JobTrackerHeaderProps) {
  return (
    <PageHeader
      title="Job Tracker"
      description="Track semua lamaran kerja kamu dalam satu papan"
    >
      <div className="flex items-center gap-3">
        <div className="border-border bg-card flex rounded-none border p-1">
          <button
            onClick={() => onViewChange("table")}
            className={cn(
              "flex items-center gap-1.5 rounded-none px-3 py-1.5 text-xs font-medium transition-all",
              view === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Table2 className="h-3.5 w-3.5" />
            Tabel
          </button>
          <button
            onClick={() => onViewChange("kanban")}
            className={cn(
              "flex items-center gap-1.5 rounded-none px-3 py-1.5 text-xs font-medium transition-all",
              view === "kanban"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <KanbanIcon className="h-3.5 w-3.5" />
            Kanban
          </button>
        </div>
        <Button
          onClick={onLinkedInImportClick}
          variant="outline"
          className="flex items-center gap-2 rounded-none px-4 py-5 text-sm font-semibold transition-all"
        >
          <Link2 className="h-4 w-4" />
          Import LinkedIn
        </Button>
        <Button
          onClick={onAddClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-none px-4 py-5 text-sm font-semibold transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Lamaran
        </Button>
      </div>
    </PageHeader>
  );
}
