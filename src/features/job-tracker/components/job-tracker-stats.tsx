"use client";

import {
  Briefcase,
  CalendarCheck,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type { JobApplication } from "@/features/job-tracker/types";
import { cn } from "@/lib/utils/cn";

interface JobTrackerStatsProps {
  jobs: JobApplication[];
}

export function JobTrackerStats({ jobs }: JobTrackerStatsProps) {
  const total = jobs.length;
  const interviewing = jobs.filter((j) => j.status === "interview").length;
  const accepted = jobs.filter((j) => j.status === "penawaran").length;
  const rejected = jobs.filter((j) => j.status === "ditolak").length;

  const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  const stats = [
    {
      label: "Total Lamaran",
      value: total,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Interview",
      value: interviewing,
      icon: CalendarCheck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Penawaran",
      value: accepted,
      icon: Trophy,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Ditolak",
      value: rejected,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-muted/30 flex flex-col gap-3 rounded-none border-none p-4 shadow-none"
        >
          <div className="flex items-center justify-between">
            <div className={cn("rounded-none p-2", stat.bg)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              {stat.value}
            </span>
          </div>
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            {stat.label}
          </span>
        </Card>
      ))}
    </div>
  );
}
