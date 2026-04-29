"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreateNewResumePage() {
  const router = useRouter();

  useEffect(() => {
    // Generate a new UUID and redirect to the builder
    const id = uuidv4();
    router.replace(`/resume-builder/${id}`);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-none border-4 border-brand-500 border-t-transparent" />
        <p className="text-surface-400 animate-pulse">
          Menyiapkan workspace baru...
        </p>
      </div>
    </div>
  );
}
