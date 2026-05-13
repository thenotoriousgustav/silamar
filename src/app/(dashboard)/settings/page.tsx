import { Bell, CreditCard, User } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { CREDIT_PACKAGES, PRO_SUBSCRIPTION } from "@/lib/payment/midtrans";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Pengaturan",
  description: "Kelola akun, langganan, dan preferensi kamu",
};

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
        <p className="text-surface-300 mt-1 text-sm">
          Kelola profil dan langganan kamu
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar nav */}
        <nav className="glass h-fit rounded-none p-4">
          <ul className="space-y-1">
            {[
              { icon: User, label: "Profil", active: true },
              { icon: CreditCard, label: "Billing & Kredit" },
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

          {/* Billing */}
          <div className="glass rounded-none p-6">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold text-white">
              <CreditCard className="text-brand-400 h-4 w-4" />
              Billing & Kredit
            </h2>

            {/* Current Plan */}
            <div className="bg-surface-800 mb-6 rounded-none p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
                  </div>
                  <div className="text-surface-300 mt-0.5 text-xs">
                    {user.plan === "pro"
                      ? `Aktif hingga ${formatDate(user.planExpiresAt)}`
                      : "Upgrade untuk akses unlimited AI"}
                  </div>
                </div>
                {user.plan !== "pro" && (
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {user.credits ?? 0}
                    </div>
                    <div className="text-surface-300 text-xs">kredit</div>
                  </div>
                )}
              </div>
            </div>

            {/* Pro Subscription */}
            <div className="border-brand-500/30 bg-brand-500/5 mb-4 rounded-none border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">
                    {PRO_SUBSCRIPTION.name}
                  </div>
                  <div className="text-brand-400 text-sm">
                    Unlimited semua fitur AI
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(PRO_SUBSCRIPTION.price)}
                  </div>
                  <div className="text-surface-300 text-xs">/bulan</div>
                </div>
              </div>
              <button
                id="btn-buy-pro"
                className="bg-brand-600 hover:bg-brand-500 mt-4 w-full rounded-none py-2.5 text-sm font-bold text-white transition-all"
              >
                {user.plan === "pro" ? "Perpanjang Pro" : "Upgrade ke Pro"}
              </button>
            </div>

            {/* Credit Packages */}
            <h3 className="text-surface-300 mb-3 text-xs font-semibold tracking-wider uppercase">
              Beli Kredit Satuan
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {CREDIT_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-surface-800 rounded-none border border-white/10 p-4 text-center"
                >
                  <div className="text-xl font-bold text-white">
                    {pkg.credits}
                  </div>
                  <div className="text-surface-300 mb-2 text-xs">kredit</div>
                  <div className="text-brand-400 text-sm font-semibold">
                    {formatCurrency(pkg.price)}
                  </div>
                  <button
                    id={`btn-buy-${pkg.id}`}
                    className="bg-surface-700 hover:bg-surface-600 mt-3 w-full rounded-none py-1.5 text-xs font-semibold text-white transition-colors"
                  >
                    Beli
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
