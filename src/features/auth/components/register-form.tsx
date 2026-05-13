"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/client";

import { type RegisterForm, registerSchema } from "../schemas";

export function RegisterFormComponent() {
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
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Gagal membuat akun");
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success("Akun berhasil dibuat! Selamat datang 🎉");
          router.push("/dashboard");
          router.refresh();
        },
      },
    );
  };

  return (
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
            className="text-surface-400 hover:text-surface-200 absolute top-1/2 right-3 -translate-y-1/2"
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
        className="bg-primary hover:bg-primary/90 hover:shadow-primary/30 text-primary-foreground flex w-full items-center justify-center gap-2 rounded-none py-3 text-sm font-bold transition-all hover:shadow-lg disabled:opacity-50"
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
  );
}
