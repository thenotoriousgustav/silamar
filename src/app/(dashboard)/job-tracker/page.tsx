"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Plus,
  Kanban as KanbanIcon,
  Table2,
  Loader2,
  GripVertical,
  Building2,
  Clock,
  ExternalLink,
  Trash2,
  PencilLine,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  JOB_STATUS_LABELS,
  KANBAN_COLUMNS,
  type JobStatus,
  type JobApplication,
} from "@/types/job";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { AddJobDrawer } from "@/components/dashboard/job-tracker/add-job-drawer";
import { JobDetailDrawer } from "@/components/dashboard/job-tracker/job-detail-drawer";
import { Button } from "@/components/ui/button";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban";
import type { DragEndEvent } from "@dnd-kit/core";

const STATUS_COLORS: Record<JobStatus, string> = {
  dilamar: "border-blue-500/30 bg-blue-500/5",
  interview: "border-amber-500/30 bg-amber-500/5",
  penawaran: "border-emerald-500/30 bg-emerald-500/5",
  ditolak: "border-red-500/30 bg-red-500/5",
};

const STATUS_BADGE: Record<JobStatus, string> = {
  dilamar: "bg-blue-500/20 text-blue-400",
  interview: "bg-amber-500/20 text-amber-400",
  penawaran: "bg-emerald-500/20 text-emerald-400",
  ditolak: "bg-red-500/20 text-red-400",
};

const COLUMN_ORDER_KEY = "silamar-job-tracker-column-order";

export default function JobTrackerPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobApplication | null>(null);
  const [localJobs, setLocalJobs] = useState<JobApplication[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(COLUMN_ORDER_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse column order", e);
        }
      }
    }
    return ["dilamar", "interview", "penawaran", "ditolak"];
  });

  // Track original status before drag starts
  const dragStartStatusRef = useRef<string | null>(null);

  // 1. Fetch Jobs Query
  const { data: jobs = [], isLoading } = useQuery<JobApplication[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await fetch("/api/jobs");
      if (!response.ok) throw new Error("Gagal mengambil data lamaran");
      return response.json();
    },
  });

  // Sync localJobs with jobs from query
  useEffect(() => {
    if (jobs.length > 0) {
      setLocalJobs(jobs);
    }
  }, [jobs]);

  // 2. Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus lamaran");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Lamaran berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setJobToDelete(null);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Terjadi kesalahan saat menghapus data");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error("Gagal memperbarui status");
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Status diperbarui ke ${JOB_STATUS_LABELS[variables.status as JobStatus]}`,
      );
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal memperbarui status ke server");
    },
  });

  // 3. Derived State (Columns)
  const columns = useMemo(() => {
    const newColumns: Record<string, JobApplication[]> = {};
    columnOrder.forEach((status) => {
      newColumns[status] = [];
    });

    // Add any missing statuses
    ["dilamar", "interview", "penawaran", "ditolak"].forEach((status) => {
      if (!newColumns[status]) newColumns[status] = [];
    });

    localJobs.forEach((job) => {
      if (newColumns[job.status]) {
        newColumns[job.status].push(job);
      }
    });

    return newColumns;
  }, [localJobs, columnOrder]);

  const handleDeleteJob = () => {
    if (jobToDelete) {
      deleteMutation.mutate(jobToDelete.id);
    }
  };

  const handleOpenDetail = (job: JobApplication) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  const handleColumnsChange = (
    newColumns: Record<string, JobApplication[]>,
  ) => {
    const newOrder = Object.keys(newColumns);
    setColumnOrder(newOrder);
    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(newOrder));

    // Update localJobs based on newColumns to reflect drag changes
    const flattenedJobs: JobApplication[] = [];
    Object.entries(newColumns).forEach(([status, items]) => {
      items.forEach((item) => {
        flattenedJobs.push({ ...item, status: status as JobStatus });
      });
    });
    setLocalJobs(flattenedJobs);
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    // Find which column this item belongs to
    if (!(active.id in columns)) {
      for (const [status, items] of Object.entries(columns)) {
        if (items.some((item) => item.id === active.id)) {
          dragStartStatusRef.current = status;
          break;
        }
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const isColumnDrag = active.id in columns;

    if (!isColumnDrag) {
      let finalStatus = "";
      for (const [status, items] of Object.entries(columns)) {
        if (items.some((item) => item.id === active.id)) {
          finalStatus = status;
          break;
        }
      }

      if (
        dragStartStatusRef.current &&
        finalStatus &&
        dragStartStatusRef.current !== finalStatus
      ) {
        updateStatusMutation.mutate({
          id: active.id as string,
          status: finalStatus,
        });
      }
    }

    dragStartStatusRef.current = null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Job Tracker</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Track semua lamaran kerja kamu dalam satu papan
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="border-border bg-card flex rounded-xl border p-1">
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                view === "kanban"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <KanbanIcon className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                view === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Table2 className="h-3.5 w-3.5" />
              Tabel
            </button>
          </div>
          <button
            id="btn-add-job"
            onClick={() => setIsAddOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Lamaran
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="text-brand-400 h-8 w-8 animate-spin" />
        </div>
      )}

      {!isLoading && view === "kanban" && (
        <Kanban
          value={columns}
          onValueChange={handleColumnsChange}
          getItemValue={(item) => item.id}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <KanbanBoard className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.keys(columns).map((status) => {
              const colInfo = KANBAN_COLUMNS.find((c) => c.id === status);
              return (
                <JobColumn
                  key={status}
                  value={status}
                  label={colInfo?.label || status}
                  tasks={columns[status] || []}
                  onItemClick={handleOpenDetail}
                  onItemDelete={(job) => setJobToDelete(job)}
                />
              );
            })}
          </KanbanBoard>
          <KanbanOverlay>
            {({ value, variant }) => {
              if (variant === "column") {
                const col = KANBAN_COLUMNS.find((c) => c.id === value);
                return (
                  <JobColumn
                    value={value}
                    label={col?.label || (value as string)}
                    tasks={columns[value] || []}
                  />
                );
              }

              const job = Object.values(columns)
                .flat()
                .find((j) => j.id === value);

              if (!job) return null;

              return <JobCard job={job} />;
            }}
          </KanbanOverlay>
        </Kanban>
      )}

      {!isLoading && view === "table" && (
        <div className="glass overflow-hidden rounded-2xl">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Briefcase className="text-surface-400 mb-3 h-10 w-10" />
              <p className="text-surface-300 text-sm">
                Belum ada lamaran kerja
              </p>
              <button
                onClick={() => setIsAddOpen(true)}
                className="bg-brand-600 hover:bg-brand-500 mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Tambah Lamaran Pertama
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "Posisi",
                    "Perusahaan",
                    "Tipe",
                    "Status",
                    "Tanggal",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => handleOpenDetail(job)}
                    className="hover:bg-muted/50 border-border/50 cursor-pointer border-b transition-colors"
                  >
                    <td className="text-foreground px-4 py-3 font-medium">
                      {job.position}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {job.company}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 capitalize">
                      {job.type}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                          STATUS_BADGE[job.status as JobStatus],
                        )}
                      >
                        {JOB_STATUS_LABELS[job.status as JobStatus]}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {job.appliedDate
                        ? formatDate(job.appliedDate, "d MMM yyyy")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(job);
                          }}
                        >
                          <PencilLine className="text-muted-foreground h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/10 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setJobToDelete(job);
                          }}
                        >
                          <Trash2 className="text-destructive h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <AddJobDrawer
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["jobs"] })}
      />

      <JobDetailDrawer
        job={selectedJob}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["jobs"] })}
        onDelete={(job) => {
          setIsDetailOpen(false);
          setJobToDelete(job);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!jobToDelete}
        onOpenChange={(open) => !open && setJobToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="bg-destructive/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Lamaran?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Lamaran kamu di{" "}
              <span className="text-foreground font-semibold">
                {jobToDelete?.company}
              </span>{" "}
              akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="bg-muted border-none">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteJob();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Hapus Sekarang"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Sub-components for Kanban
interface JobCardProps extends Omit<
  React.ComponentProps<typeof KanbanItem>,
  "value"
> {
  job: JobApplication;
  onItemClick?: (job: JobApplication) => void;
  onItemDelete?: (job: JobApplication) => void;
}

function JobCard({ job, onItemClick, onItemDelete, ...props }: JobCardProps) {
  return (
    <KanbanItem
      key={job.id}
      value={job.id}
      asChild
      {...props}
      onClick={() => onItemClick?.(job)}
    >
      <div className="group glass hover:border-primary/20 border-border/50 relative cursor-pointer rounded-xl border p-4 shadow-sm transition-all">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-foreground line-clamp-1 text-sm font-semibold">
                {job.position}
              </div>
              <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                <Building2 className="h-3 w-3" /> {job.company}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/10 absolute top-2 right-2 h-7 w-7 opacity-0 transition-all group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onItemDelete?.(job);
              }}
            >
              <Trash2 className="text-destructive h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
              {job.type}
            </div>
            {job.appliedDate && (
              <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                <Clock className="h-2.5 w-2.5" />{" "}
                {formatDate(job.appliedDate, "d MMM")}
              </div>
            )}
          </div>
        </div>
      </div>
    </KanbanItem>
  );
}

interface JobColumnProps extends Omit<
  React.ComponentProps<typeof KanbanColumn>,
  "children"
> {
  tasks: JobApplication[];
  label: string;
  onItemClick?: (job: JobApplication) => void;
  onItemDelete?: (job: JobApplication) => void;
}

function JobColumn({
  value,
  tasks,
  label,
  onItemClick,
  onItemDelete,
  ...props
}: JobColumnProps) {
  const statusId = value as JobStatus;

  return (
    <KanbanColumn
      value={value}
      className={cn("rounded-2xl border p-4", STATUS_COLORS[statusId])}
      {...props}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground text-sm font-semibold">{label}</h3>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-bold",
              STATUS_BADGE[statusId],
            )}
          >
            {tasks.length}
          </span>
        </div>
        <KanbanColumnHandle asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </KanbanColumnHandle>
      </div>

      <div className="flex min-h-25 flex-col gap-3">
        {tasks.length === 0 && (
          <div className="border-border/50 bg-background/20 rounded-xl border border-dashed py-8 text-center">
            <Briefcase className="text-muted-foreground/30 mx-auto mb-2 h-5 w-5" />
            <p className="text-muted-foreground/50 text-xs">Kosong</p>
          </div>
        )}
        {tasks.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            asHandle
            onItemClick={onItemClick}
            onItemDelete={onItemDelete}
          />
        ))}
      </div>
    </KanbanColumn>
  );
}
