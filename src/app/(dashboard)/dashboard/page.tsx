import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { resumes, jobApplications, aiUsageLogs } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  BarChart3,
  Mail,
  Target,
  Brain,
  ArrowRight,
  Coins,
  TrendingUp,
  Plus,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardData(userId: string) {
  const [resumeCount, jobCount, recentJobs, recentActivity] = await Promise.all(
    [
      db
        .select({ count: count() })
        .from(resumes)
        .where(eq(resumes.userId, userId)),
      db
        .select({ count: count() })
        .from(jobApplications)
        .where(eq(jobApplications.userId, userId)),
      db
        .select()
        .from(jobApplications)
        .where(eq(jobApplications.userId, userId))
        .orderBy(desc(jobApplications.createdAt))
        .limit(5),
      db
        .select()
        .from(aiUsageLogs)
        .where(eq(aiUsageLogs.userId, userId))
        .orderBy(desc(aiUsageLogs.createdAt))
        .limit(5),
    ],
  );

  return {
    resumeCount: resumeCount[0]?.count ?? 0,
    jobCount: jobCount[0]?.count ?? 0,
    recentJobs,
    recentActivity,
  };
}

const quickActions = [
  {
    href: "/resume-builder",
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
  { href: "/cover-letter", icon: Mail, label: "Cover Letter", color: "blue" },
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const data = await getDashboardData(session.user.id);
  const user = session.user as typeof session.user & {
    credits?: number;
    plan?: string;
  };
  const credits = user.credits ?? 0;
  const plan = user.plan ?? "free";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Halo, {session.user.name?.split(" ")[0]}! 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Semangat cari kerja hari ini!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-primary/20 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <Link
              href="/resume-builder"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Lihat →
            </Link>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {data.resumeCount}
          </div>
          <div className="text-xs text-muted-foreground">Resume dibuat</div>
        </div>

        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-500/20 p-2">
              <Briefcase className="h-4 w-4 text-emerald-400" />
            </div>
            <Link
              href="/job-tracker"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Lihat →
            </Link>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {data.jobCount}
          </div>
          <div className="text-xs text-muted-foreground">Lamaran tertrack</div>
        </div>

        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 ${plan === "pro" ? "bg-primary/20" : "bg-amber-500/20"}`}
            >
              <Coins
                className={`h-4 w-4 ${plan === "pro" ? "text-primary" : "text-amber-400"}`}
              />
            </div>
            <Link
              href="/settings?tab=billing"
              className="text-xs text-surface-300 hover:text-white"
            >
              Beli →
            </Link>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {plan === "pro" ? "∞" : credits}
          </div>
          <div className="text-xs text-muted-foreground">
            {plan === "pro" ? "Pro subscription" : "Kredit tersisa"}
          </div>
        </div>

        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500/20 p-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {data.recentActivity.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Fitur AI digunakan
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="glass flex flex-col items-center gap-2 p-4 text-center transition-all hover:border-primary/20 hover:scale-105 group"
            >
              <div className="bg-muted p-2.5 transition-colors group-hover:bg-muted/80">
                <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
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
            <h2 className="text-sm font-semibold text-foreground">
              Lamaran Terbaru
            </h2>
            <Link
              href="/job-tracker"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {data.recentJobs.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Briefcase className="mb-3 h-8 w-8 text-surface-400" />
              <p className="text-sm text-surface-300">Belum ada lamaran.</p>
              <Link
                href="/job-tracker"
                className="mt-3 flex items-center gap-1 bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
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
                  className="flex items-center justify-between gap-3 bg-surface-800 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {job.position}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
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
            <h2 className="text-sm font-semibold text-foreground">
              Aktivitas AI Terbaru
            </h2>
          </div>

          {data.recentActivity.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Brain className="mb-3 h-8 w-8 text-surface-400" />
              <p className="text-sm text-surface-300">
                Belum menggunakan fitur AI.
              </p>
              <Link
                href="/resume-analysis"
                className="mt-3 bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Coba Analisis Resume
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.recentActivity.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center gap-3 bg-surface-800 p-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-primary/20">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-foreground capitalize">
                      {log.featureType.replace(/_/g, " ")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(log.createdAt)}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
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
