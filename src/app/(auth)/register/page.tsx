"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Zap, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { registerSchema, type RegisterForm } from "../schemas";

const perks = [
  "3 kredit AI gratis saat daftar",
  "Akses semua fitur dashboard",
  "Template resume ATS-friendly",
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/dashboard",
    }, {
      onError: (ctx) => {
        toast.error(ctx.error.message || "Gagal membuat akun");
        setIsLoading(false);
      },
      onSuccess: () => {
        toast.success("Akun berhasil dibuat! Selamat datang 🎉");
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    }, {
      onError: (ctx) => {
        toast.error(ctx.error.message);
      }
    });
  };

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
              <Zap className="h-5 w-5 text-primary-foreground" />
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
          <button
            onClick={handleGoogleSignIn}
            className="hover:bg-surface-800 flex w-full items-center justify-center gap-3 rounded-none border border-white/10 py-3 text-sm font-semibold text-white transition-all"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Daftar dengan Google
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-900 px-2 text-surface-400">
                Atau email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-surface-200 mb-1.5 block text-sm font-medium">
                Nama Lengkap
              </label>
              <input
                {...register("name")}
                id="input-name"
                type="text"
                placeholder="Budi Santoso"
                className={`bg-surface-800 placeholder-surface-300 focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-none border border-white/10 px-4 py-3 text-sm text-white transition-all outline-none focus:ring-2 ${
                  errors.name ? "border-red-500/50" : ""
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-surface-200 mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                {...register("email")}
                id="input-email"
                type="email"
                placeholder="kamu@email.com"
                className={`bg-surface-800 placeholder-surface-300 focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-none border border-white/10 px-4 py-3 text-sm text-white transition-all outline-none focus:ring-2 ${
                  errors.email ? "border-red-500/50" : ""
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-surface-200 mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter"
                  className={`bg-surface-800 placeholder-surface-300 focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-none border border-white/10 px-4 py-3 text-sm text-white transition-all outline-none focus:ring-2 ${
                    errors.password ? "border-red-500/50" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-surface-400 hover:text-surface-200 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              id="btn-submit-register"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 hover:shadow-primary/30 flex w-full items-center justify-center gap-2 rounded-none py-3 text-sm font-bold text-primary-foreground transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Daftar...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

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
