"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { JobApplication, JobStatus, CreateJobApplicationInput } from "@/types/job";

export function useJobTracker() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setJobs(data.jobs ?? []);
    } catch {
      toast.error("Gagal memuat data lamaran");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addJob = useCallback(async (input: CreateJobApplicationInput) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create");
      const { job } = await res.json();
      setJobs((prev: JobApplication[]) => [job, ...prev]);
      toast.success("Lamaran berhasil ditambahkan!");
      return job as JobApplication;
    } catch {
      toast.error("Gagal menambahkan lamaran");
      return null;
    }
  }, []);

  const updateJobStatus = useCallback(
    async (jobId: string, status: JobStatus) => {
      const prevJob = jobs.find((j) => j.id === jobId);
      if (!prevJob) return;

      // Optimistic update
      setJobs((prevJobs: JobApplication[]) =>
        prevJobs.map((j) => (j.id === jobId ? { ...j, status } : j))
      );

      try {
        const res = await fetch(`/api/jobs/${jobId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast.success("Status diperbarui!");
      } catch {
        // Revert optimistic update
        setJobs((prevJobs: JobApplication[]) =>
          prevJobs.map((j) => (j.id === jobId ? prevJob : j))
        );
        toast.error("Gagal memperbarui status");
      }
    },
    [jobs]
  );

  const deleteJob = useCallback(async (jobId: string) => {
    setJobs((prev: JobApplication[]) => prev.filter((j) => j.id !== jobId));
    try {
      await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      toast.success("Lamaran dihapus");
    } catch {
      toast.error("Gagal menghapus lamaran");
    }
  }, []);

  const getJobsByStatus = useCallback(
    (status: JobStatus) => jobs.filter((j) => j.status === status),
    [jobs]
  );

  return {
    jobs,
    isLoading,
    fetchJobs,
    addJob,
    updateJobStatus,
    deleteJob,
    getJobsByStatus,
  };
}
