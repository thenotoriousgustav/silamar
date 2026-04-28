"use client";

import { useSession } from "@/lib/auth/client";

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  credits?: number;
  plan?: string;
  planExpiresAt?: Date | null;
}

export function useCredits() {
  const { data: session, isPending } = useSession();

  const user = session?.user as ExtendedUser | undefined;

  const credits = user?.credits ?? 0;
  const plan = user?.plan ?? "free";
  const isPro = plan === "pro";
  const hasCredits = isPro || credits > 0;

  const checkCredits = (): boolean => {
    if (isPro) return true;
    if (credits <= 0) return false;
    return true;
  };

  return {
    credits,
    plan,
    isPro,
    hasCredits,
    isLoading: isPending,
    checkCredits,
  };
}
