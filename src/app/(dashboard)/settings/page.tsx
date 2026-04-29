import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Settings, User, CreditCard, Bell } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { CREDIT_PACKAGES, PRO_SUBSCRIPTION } from "@/lib/payment/midtrans";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = session.user as typeof session.user & {
    credits?: number;
    plan?: string;
    planExpiresAt?: Date | null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
        <p className="mt-1 text-sm text-surface-300">
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
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <div className="glass rounded-none p-6">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold text-white">
              <User className="h-4 w-4 text-brand-400" />
              Profil
            </h2>
            <div className="flex items-center gap-4 mb-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? ""}
                  className="h-14 w-14 rounded-none object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-none bg-brand-600 text-xl font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
              )}
              <div>
                <div className="font-semibold text-white">{user.name}</div>
                <div className="text-sm text-surface-300">{user.email}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-200">
                  Nama Lengkap
                </label>
                <input
                  defaultValue={user.name ?? ""}
                  id="input-profile-name"
                  className="w-full rounded-none border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-200">
                  Email
                </label>
                <input
                  defaultValue={user.email ?? ""}
                  disabled
                  className="w-full rounded-none border border-white/5 bg-surface-800/50 px-4 py-3 text-sm text-surface-300 outline-none cursor-not-allowed"
                />
              </div>
              <button
                id="btn-save-profile"
                className="rounded-none bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 transition-all"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>

          {/* Billing */}
          <div className="glass rounded-none p-6">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold text-white">
              <CreditCard className="h-4 w-4 text-brand-400" />
              Billing & Kredit
            </h2>

            {/* Current Plan */}
            <div className="mb-6 rounded-none bg-surface-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
                  </div>
                  <div className="text-xs text-surface-300 mt-0.5">
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
                    <div className="text-xs text-surface-300">kredit</div>
                  </div>
                )}
              </div>
            </div>

            {/* Pro Subscription */}
            <div className="mb-4 rounded-none border border-brand-500/30 bg-brand-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{PRO_SUBSCRIPTION.name}</div>
                  <div className="text-sm text-brand-400">Unlimited semua fitur AI</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(PRO_SUBSCRIPTION.price)}
                  </div>
                  <div className="text-xs text-surface-300">/bulan</div>
                </div>
              </div>
              <button
                id="btn-buy-pro"
                className="mt-4 w-full rounded-none bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-500 transition-all"
              >
                {user.plan === "pro" ? "Perpanjang Pro" : "Upgrade ke Pro"}
              </button>
            </div>

            {/* Credit Packages */}
            <h3 className="mb-3 text-xs font-semibold text-surface-300 uppercase tracking-wider">
              Beli Kredit Satuan
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {CREDIT_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="rounded-none border border-white/10 bg-surface-800 p-4 text-center">
                  <div className="text-xl font-bold text-white">{pkg.credits}</div>
                  <div className="text-xs text-surface-300 mb-2">kredit</div>
                  <div className="text-sm font-semibold text-brand-400">
                    {formatCurrency(pkg.price)}
                  </div>
                  <button
                    id={`btn-buy-${pkg.id}`}
                    className="mt-3 w-full rounded-none bg-surface-700 py-1.5 text-xs font-semibold text-white hover:bg-surface-600 transition-colors"
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
