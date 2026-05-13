import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MarketingNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 text-5xl">🔍</div>
        <h1 className="text-xl font-bold text-white">Halaman Tidak Ditemukan</h1>
        <p className="text-surface-300 mt-2 text-sm">
          Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button asChild variant="default" size="lg">
            <Link href="/">Ke Halaman Utama</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
