"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Global network status monitor.
 * Shows a persistent toast when the user goes offline, and a success toast
 * when they come back online. Mount once in the root layout.
 */
export function NetworkStatus() {
  const wasOffline = useRef(false);

  useEffect(() => {
    const handleOffline = () => {
      wasOffline.current = true;
      toast.error("Koneksi internet terputus", {
        id: "network-status",
        description: "Perubahan akan disimpan secara lokal sampai koneksi kembali.",
        duration: Infinity,
      });
    };

    const handleOnline = () => {
      if (wasOffline.current) {
        wasOffline.current = false;
        toast.success("Koneksi internet kembali", {
          id: "network-status",
          description: "Semua perubahan akan disinkronkan.",
          duration: 4000,
        });
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Check initial state
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}
