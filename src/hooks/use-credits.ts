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

  const credits = user?.credits ?? 999999;
  const plan = "pro";
  const isPro = true;
  const hasCredits = true;

  const checkCredits = (): boolean => {
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
