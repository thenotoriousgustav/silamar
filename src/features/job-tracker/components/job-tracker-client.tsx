"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { JobApplication, JobStatus } from "@/features/job-tracker/types";
import {
  KANBAN_COLUMNS,
  VIEW_PREFERENCE_KEY,
  COLUMN_ORDER_KEY,
} from "@/features/job-tracker/constants";
import {
  getJobsAction,
  deleteJobAction,
  updateJobAction,
} from "@/features/job-tracker/actions";
import { useDataTable } from "@/hooks/use-data-table";
import type { DragEndEvent } from "@dnd-kit/core";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { JobTrackerTable } from "./data-table/job-tracker-table";
import { JobTrackerKanban } from "./kanban/job-tracker-kanban";
import { JobTrackerHeader } from "./job-tracker-header";
import { JobTrackerDialogs } from "./job-tracker-dialogs";
import { getJobTrackerColumns } from "./data-table/job-tracker-table-columns";
import { triggerSuccessConfetti } from "@/lib/utils/confetti";
import { JobTrackerStats } from "./job-tracker-stats";

interface JobTrackerClientProps {
  initialJobs: JobApplication[];
  initialView?: "kanban" | "table";
  initialColumnOrder?: string[];
}

export function JobTrackerClient({
  initialJobs,
  initialView = "table",
  initialColumnOrder,
}: JobTrackerClientProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"kanban" | "table">(initialView);

  const handleViewChange = (newView: "kanban" | "table") => {
    setView(newView);
    document.cookie = `${VIEW_PREFERENCE_KEY}=${newView}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobApplication | null>(null);
  const [localJobs, setLocalJobs] = useState<JobApplication[]>(initialJobs);

  // Sync drawer with URL jobId
  useEffect(() => {
    const jobId = searchParams.get("jobId");
    if (jobId) {
      const job = localJobs.find((j) => j.id === jobId);
      if (job) {
        setSelectedJob(job);
        setIsDetailOpen(true);
      }
    } else {
      setIsDetailOpen(false);
    }
  }, [searchParams, localJobs]);

  const updateUrl = (jobId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (jobId) {
      params.set("jobId", jobId);
    } else {
      params.delete("jobId");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const currentQueryParams = useMemo(() => {
    const params: any = {};
    searchParams.forEach((value, key) => {
      if (key === "jobId") return; // Skip jobId for data fetching
      if (["type", "status"].includes(key)) {
        params[key] = value.split(",");
      } else if (key === "appliedDate") {
        const parts = value.includes(".") ? value.split(".") : value.split(",");
        if (parts.length === 2) {
          params.from = parts[0];
          params.to = parts[1];
        } else {
          params.from = value;
          params.to = value;
        }
      } else {
        params[key] = value;
      }
    });
    return params;
  }, [searchParams]);

  const {
    data: jobs,
    isLoading,
    isFetching,
  } = useQuery<JobApplication[]>({
    queryKey: ["jobs", currentQueryParams],
    queryFn: () => getJobsAction(currentQueryParams) as any,
    initialData: undefined,
  });

  useEffect(() => {
    if (jobs) {
      setLocalJobs(jobs);
    }
  }, [jobs]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJobAction(id),
    onSuccess: () => {
      toast.success("Lamaran berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setJobToDelete(null);
      updateUrl(null);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal menghapus lamaran");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateJobAction(id, { status: status as any }),
    onSuccess: (_, variables) => {
      if (variables.status === "penawaran") {
        triggerSuccessConfetti();
        toast.success("Selamat! Anda mendapatkan penawaran kerja!");
      }
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal memperbarui status");
    },
  });

  const handleOpenDetail = (job: JobApplication) => {
    updateUrl(job.id);
  };

  const handleEditJob = (job: JobApplication) => {
    updateUrl(job.id);
  };

  // Table Logic
  const columns = useMemo(
    () =>
      getJobTrackerColumns({ onEdit: handleEditJob, onDelete: setJobToDelete }),
    [],
  );

  const { table } = useDataTable({
    data: localJobs,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
    shallow: false,
  });

  // Kanban Logic
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    if (initialColumnOrder) return initialColumnOrder;

    if (typeof document !== "undefined") {
      const match = document.cookie.match(
        new RegExp("(^| )" + COLUMN_ORDER_KEY + "=([^;]+)"),
      );
      if (match && match[2]) {
        try {
          return JSON.parse(decodeURIComponent(match[2]));
        } catch (e) {
          console.error("Failed to parse column order cookie", e);
        }
      }
    }
    return KANBAN_COLUMNS.map((c) => c.id);
  });

  const kanbanColumns = useMemo(() => {
    const grouped = columnOrder.reduce(
      (acc, status) => {
        acc[status] = localJobs.filter((job) => job.status === status);
        return acc;
      },
      {} as Record<string, JobApplication[]>,
    );
    return grouped;
  }, [localJobs, columnOrder]);

  const handleColumnsChange = (
    newColumns: Record<string, JobApplication[]>,
  ) => {
    const newOrder = Object.keys(newColumns);
    setColumnOrder(newOrder);
    const cookieValue = encodeURIComponent(JSON.stringify(newOrder));
    document.cookie = `${COLUMN_ORDER_KEY}=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const dragStartStatusRef = useRef<string | null>(null);

  const handleDragStart = (event: any) => {
    const { active } = event;
    const activeId = active.id as string;
    const job = localJobs.find((j) => j.id === activeId);
    if (job) {
      dragStartStatusRef.current = job.status;
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const job = localJobs.find((j) => j.id === activeId);
    if (job && dragStartStatusRef.current !== overId) {
      updateStatusMutation.mutate({ id: activeId, status: overId });
      setLocalJobs((prev) =>
        prev.map((j) =>
          j.id === activeId ? { ...j, status: overId as JobStatus } : j,
        ),
      );
    }
    dragStartStatusRef.current = null;
  };

  return (
    <div className="space-y-6">
      <JobTrackerStats jobs={localJobs} />

      <JobTrackerHeader
        view={view}
        onViewChange={handleViewChange}
        onAddClick={() => setIsAddOpen(true)}
      />

      {view === "kanban" ? (
        <JobTrackerKanban
          columns={kanbanColumns}
          onColumnsChange={handleColumnsChange}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onItemClick={handleOpenDetail}
          onItemEdit={handleEditJob}
          onItemDelete={setJobToDelete}
        />
      ) : (
        <JobTrackerTable
          table={table}
          isLoading={isLoading || isFetching}
          onRowClick={handleOpenDetail}
          onEditJob={handleEditJob}
          onDeleteJob={setJobToDelete}
        />
      )}

      <JobTrackerDialogs
        isAddOpen={isAddOpen}
        setIsAddOpen={setIsAddOpen}
        selectedJob={selectedJob}
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={(open) => {
          if (!open) updateUrl(null);
          setIsDetailOpen(open);
        }}
        jobToDelete={jobToDelete}
        setJobToDelete={setJobToDelete}
        onAddSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["jobs"] })
        }
        onDetailSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["jobs"] })
        }
        onConfirmDelete={(id) => deleteMutation.mutate(id)}
        trackerId={currentQueryParams.trackerId}
      />
    </div>
  );
}
