"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AuthError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 text-5xl">⚠️</div>
        <h1 className="text-xl font-bold text-white">Terjadi Kesalahan</h1>
        <p className="text-surface-300 mt-2 text-sm">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button onClick={reset} variant="default" size="lg">
            Coba Lagi
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
