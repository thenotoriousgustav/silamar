import { Bell, CheckCircle2, ShieldCheck, Sparkles, User } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Pengaturan",
  description: "Kelola akun dan preferensi kamu",
};

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
        <p className="text-surface-300 mt-1 text-sm">
          Kelola profil dan akun kamu
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar nav */}
        <nav className="glass h-fit rounded-none p-4">
          <ul className="space-y-1">
            {[
              { icon: User, label: "Profil", active: true },
              { icon: ShieldCheck, label: "Status Langganan" },
              { icon: Bell, label: "Notifikasi" },
            ].map((item) => (
              <li key={item.label}>
                <button
                  className={`flex w-full items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium transition-all ${
                    item.active
                      ? "bg-brand-600/20 text-brand-400"
                      : "text-surface-300 hover:bg-surface-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile */}
          <div className="glass rounded-none p-6">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold text-white">
              <User className="text-brand-400 h-4 w-4" />
              Profil
            </h2>
            <div className="mb-6 flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? ""}
                  className="h-14 w-14 rounded-none object-cover"
                />
              ) : (
                <div className="bg-brand-600 flex h-14 w-14 items-center justify-center rounded-none text-xl font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
              )}
              <div>
                <div className="font-semibold text-white">{user.name}</div>
                <div className="text-surface-300 text-sm">{user.email}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-surface-200 mb-1.5 block text-xs font-medium">
                  Nama Lengkap
                </label>
                <input
                  defaultValue={user.name ?? ""}
                  id="input-profile-name"
                  className="bg-surface-800 focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-none border border-white/10 px-4 py-3 text-sm text-white outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="text-surface-200 mb-1.5 block text-xs font-medium">
                  Email
                </label>
                <input
                  defaultValue={user.email ?? ""}
                  disabled
                  className="bg-surface-800/50 text-surface-300 w-full cursor-not-allowed rounded-none border border-white/5 px-4 py-3 text-sm outline-none"
                />
              </div>
              <button
                id="btn-save-profile"
                className="bg-brand-600 hover:bg-brand-500 rounded-none px-6 py-2.5 text-sm font-semibold text-white transition-all"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>

          {/* Subscription / Plan Status */}
          <div className="glass rounded-none p-6">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="text-emerald-400 h-4 w-4" />
              Status Akun & Fitur
            </h2>

            <div className="bg-surface-800 mb-6 rounded-none p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">Paket Gratis Selamanya</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 font-semibold">
                      Aktif
                    </span>
                  </div>
                  <p className="text-surface-300 mt-1.5 text-sm">
                    Kamu memiliki akses tak terbatas (unlimited) ke seluruh fitur AI tanpa biaya dan tanpa sistem kredit.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-surface-900/50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                <Sparkles className="h-4 w-4 text-brand-400" />
                Semua Fitur Tersedia Gratis:
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 text-xs text-surface-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Resume Builder ATS-Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>AI Resume & ATS Analyzer (Unlimited)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>AI Cover Letter Generator (Unlimited)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Mock Interview AI (Unlimited)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Job Tracker Kanban Board</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Resume Roast AI (Unlimited)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
