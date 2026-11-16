"use server";

import { randomUUID } from "crypto";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import {
  createSnapTransaction,
  getCreditPackage,
  PRO_SUBSCRIPTION,
} from "@/lib/payment/midtrans";
import type { ActionResult } from "@/types/action-result";

import { createTransactionSchema } from "./schemas";
import type { CreateTransactionInput } from "./schemas";

type CreateTransactionResult = {
  snapToken: string;
  orderId: string;
};

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<ActionResult<CreateTransactionResult>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { packageId, type } = parsed.data;

  let amount: number;
  let credits: number | null = null;
  let itemName: string;

  if (type === "credit") {
    const pkg = getCreditPackage(packageId);
    if (!pkg) return { success: false, error: "Paket tidak ditemukan" };
    amount = pkg.price;
    credits = pkg.credits;
    itemName = pkg.name;
  } else {
    if (packageId !== PRO_SUBSCRIPTION.id) {
      return { success: false, error: "Paket subscription tidak ditemukan" };
    }
    amount = PRO_SUBSCRIPTION.price;
    itemName = PRO_SUBSCRIPTION.name;
  }

  try {
    const orderId = `SILAMAR-${randomUUID().slice(0, 8).toUpperCase()}`;

    await db.insert(transactions).values({
      id: randomUUID(),
      userId: user.id,
      orderId,
      amount,
      credits,
      status: "pending",
      packageId,
    });

    const snapResult = await createSnapTransaction({
      orderId,
      amount,
      customerName: user.name,
      customerEmail: user.email,
      itemName,
      itemId: packageId,
      quantity: 1,
    });

    await db
      .update(transactions)
      .set({
        midtransToken: snapResult.token,
        midtransRedirectUrl: snapResult.redirect_url,
      })
      .where(eq(transactions.orderId, orderId));

    updateTag("billing");

    return {
      success: true,
      data: { snapToken: snapResult.token, orderId },
    };
  } catch {
    return { success: false, error: "Gagal membuat transaksi" };
  }
}
