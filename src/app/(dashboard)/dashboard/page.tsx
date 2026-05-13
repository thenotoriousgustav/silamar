import {
  ArrowRight,
  BarChart3,
  Brain,
  Briefcase,
  Coins,
  FileText,
  Mail,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDashboardData } from "@/features/dashboard";
import { getSessionUser } from "@/lib/auth/session";
import { formatRelativeTime } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Kelola resume, cover letter, dan lamaran kerja kamu",
};

const quickActions = [
  {
    href: "/documents/resumes",
    icon: FileText,
    label: "Buat Resume",
    color: "primary",
  },
  {
    href: "/resume-analysis",
    icon: BarChart3,
    label: "Analisis Resume",
    color: "purple",
  },
  {
    href: "/documents/cover-letter",
    icon: Mail,
    label: "Cover Letter",
    color: "blue",
  },
  {
    href: "/job-tracker",
    icon: Briefcase,
    label: "Tambah Lamaran",
    color: "emerald",
  },
  { href: "/skill-gap", icon: Target, label: "Skill Gap", color: "amber" },
  {
    href: "/mock-interview",
    icon: Brain,
    label: "Mock Interview",
    color: "rose",
  },
];

const statusColors: Record<string, string> = {
  dilamar: "bg-blue-500/20 text-blue-400",
  interview: "bg-amber-500/20 text-amber-400",
  penawaran: "bg-emerald-500/20 text-emerald-400",
  ditolak: "bg-red-500/20 text-red-400",
};

const statusLabels: Record<string, string> = {
  dilamar: "Dilamar",
  interview: "Interview",
  penawaran: "Penawaran",
  ditolak: "Ditolak",
};

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) notFound();

  const data = await getDashboardData();
  if (!data) notFound();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Halo, {user.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Semangat cari kerja hari ini!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="glass p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="bg-primary/20 p-2">
              <FileText className="text-primary h-4 w-4" />
            </div>
            <Link
              href="/documents/resumes"
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Lihat →
            </Link>
          </div>
          <div className="text-foreground text-2xl font-bold">
            {data.resumeCount}
          </div>
          <div className="text-muted-foreground text-xs">Resume dibuat</div>
        </div>

        <div className="glass p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="bg-emerald-500/20 p-2">
              <Briefcase className="h-4 w-4 text-emerald-400" />
            </div>
            <Link
              href="/job-tracker"
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Lihat →
            </Link>
          </div>
          <div className="text-foreground text-2xl font-bold">
            {data.jobCount}
          </div>
          <div className="text-muted-foreground text-xs">Lamaran tertrack</div>
        </div>

        <div className="glass p-5">
          <div className="mb-3 flex items-center justify-between">
            <div
              className={`p-2 ${user.plan === "pro" ? "bg-primary/20" : "bg-amber-500/20"}`}
            >
              <Coins
                className={`h-4 w-4 ${user.plan === "pro" ? "text-primary" : "text-amber-400"}`}
              />
            </div>
            <Link
              href="/settings?tab=billing"
              className="text-surface-300 text-xs hover:text-white"
            >
              Beli →
            </Link>
          </div>
          <div className="text-foreground text-2xl font-bold">
            {user.plan === "pro" ? "∞" : user.credits}
          </div>
          <div className="text-muted-foreground text-xs">
            {user.plan === "pro" ? "Pro subscription" : "Kredit tersisa"}
          </div>
        </div>

        <div className="glass p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="bg-purple-500/20 p-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          <div className="text-foreground text-2xl font-bold">
            {data.recentActivity.length}
          </div>
          <div className="text-muted-foreground text-xs">
            Fitur AI digunakan
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-foreground mb-4 text-base font-semibold">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="glass hover:border-primary/20 group flex flex-col items-center gap-2 p-4 text-center transition-all hover:scale-105"
            >
              <div className="bg-muted group-hover:bg-muted/80 p-2.5 transition-colors">
                <action.icon className="text-muted-foreground group-hover:text-foreground h-5 w-5" />
              </div>
              <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Job Applications */}
        <div className="glass p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-sm font-semibold">
              Lamaran Terbaru
            </h2>
            <Link
              href="/job-tracker"
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {data.recentJobs.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Briefcase className="text-surface-400 mb-3 h-8 w-8" />
              <p className="text-surface-300 text-sm">Belum ada lamaran.</p>
              <Link
                href="/job-tracker"
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-3 flex items-center gap-1 px-4 py-2 text-xs font-semibold"
              >
                <Plus className="h-3 w-3" />
                Tambah Lamaran
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.recentJobs.map((job) => (
                <li
                  key={job.id}
                  className="bg-surface-800 flex items-center justify-between gap-3 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">
                      {job.position}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {job.company} · {formatRelativeTime(job.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 text-xs font-semibold ${statusColors[job.status] ?? ""}`}
                  >
                    {statusLabels[job.status] ?? job.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* AI Activity Log */}
        <div className="glass p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-sm font-semibold">
              Aktivitas AI Terbaru
            </h2>
          </div>

          {data.recentActivity.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Brain className="text-surface-400 mb-3 h-8 w-8" />
              <p className="text-surface-300 text-sm">
                Belum menggunakan fitur AI.
              </p>
              <Link
                href="/resume-analysis"
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-3 px-4 py-2 text-xs font-semibold"
              >
                Coba Analisis Resume
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.recentActivity.map((log) => (
                <li
                  key={log.id}
                  className="bg-surface-800 flex items-center gap-3 p-3"
                >
                  <div className="bg-primary/20 flex h-7 w-7 shrink-0 items-center justify-center">
                    <Brain className="text-primary h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-xs font-medium capitalize">
                      {log.featureType.replace(/_/g, " ")}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatRelativeTime(log.createdAt)}
                    </div>
                  </div>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    -{log.creditsUsed} kr
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
