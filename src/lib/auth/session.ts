import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "./index";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  credits: number;
  plan: string;
  planExpiresAt: Date | null;
};

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image ?? null,
    credits: session.user.credits,
    plan: session.user.plan,
    planExpiresAt: session.user.planExpiresAt ?? null,
  };
});
