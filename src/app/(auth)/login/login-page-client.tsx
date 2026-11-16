"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

import { GoogleSignInButton, LoginFormComponent } from "@/features/auth";

export function LoginPageClient() {
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
          <h1 className="mt-6 text-2xl font-bold text-white">
            Selamat Datang Kembali
          </h1>
          <p className="text-surface-300 mt-2 text-sm">
            Masuk ke akun kamu dan lanjutkan perjalanan karier
          </p>
        </div>

        <div className="glass rounded-none p-8">
          {/* Social Login */}
          <GoogleSignInButton label="Masuk dengan Google" />

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
          <LoginFormComponent />
        </div>

        <p className="text-surface-300 mt-6 text-center text-sm">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
