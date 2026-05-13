"use client";

import { CheckCircle, Zap } from "lucide-react";
import Link from "next/link";

import {
  GoogleSignInButton,
  RegisterFormComponent,
} from "@/features/auth";

const perks = [
  "3 kredit AI gratis saat daftar",
  "Akses semua fitur dashboard",
  "Template resume ATS-friendly",
];

export function RegisterPageClient() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(50% 0.26 290 / 15%), transparent)",
        }}
      />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-primary shadow-primary/30 flex h-10 w-10 items-center justify-center rounded-none shadow-lg">
              <Zap className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="gradient-text text-2xl font-extrabold">
              SiLamar
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Buat Akun Baru</h1>
          <p className="text-surface-300 mt-2 text-sm">
            Gabung dengan 10,000+ fresh graduate lainnya
          </p>
        </div>

        <div className="glass rounded-none p-8">
          {/* Social Login */}
          <GoogleSignInButton label="Daftar dengan Google" />

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-900 text-surface-400 px-2">
                Atau email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <RegisterFormComponent />

          {/* Perks */}
          <div className="mt-8 space-y-3 border-t border-white/5 pt-6">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-surface-300">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-surface-300 mt-6 text-center text-sm">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
