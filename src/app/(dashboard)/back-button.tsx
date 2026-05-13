"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="ghost" size="lg">
      Kembali ke Halaman Sebelumnya
    </Button>
  );
}
