import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { sendPaymentConfirmationEmail } from "@/lib/email/resend";
import {
  isPaymentSuccessful,
  type MidtransTransactionStatus,
  PRO_SUBSCRIPTION,
  verifyMidtransSignature,
} from "@/lib/payment/midtrans";
import { getCreditPackage } from "@/lib/payment/midtrans";

type TransactionStatus = "success" | "pending" | "failed" | "expired";

/**
 * Derives the normalized transaction status from Midtrans webhook data.
 * Maps Midtrans-specific statuses (capture, settlement, cancel, expire, deny)
 * to our internal status enum.
 */
function deriveTransactionStatus(
  transactionStatus: string,
  paymentSuccess: boolean,
): TransactionStatus {
  if (paymentSuccess) return "success";
  if (["cancel", "expire"].includes(transactionStatus)) return "expired";
  if (transactionStatus === "deny") return "failed";
  return "pending";
}

/** Activates Pro subscription or adds credits based on the transaction package. */
async function fulfillPayment(
  userId: string,
  packageId: string | null,
  credits: number | null,
): Promise<void> {
  if (packageId === PRO_SUBSCRIPTION.id) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + PRO_SUBSCRIPTION.duration);

    await db
      .update(users)
      .set({ plan: "pro", planExpiresAt: expiresAt })
      .where(eq(users.id, userId));
  } else if (credits) {
    await db
      .update(users)
      .set({ credits: sql`${users.credits} + ${credits}` })
      .where(eq(users.id, userId));
  }
}

/** Resolves the human-readable package name for the confirmation email. */
function resolvePackageName(packageId: string | null): string {
  if (packageId === PRO_SUBSCRIPTION.id) return PRO_SUBSCRIPTION.name;
  const pkg = packageId ? getCreditPackage(packageId) : null;
  return pkg?.name ?? "Paket SiLamar";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: paymentType,
    } = body;

    const isValid = verifyMidtransSignature({
      orderId,
      statusCode,
      grossAmount,
      receivedSignature: signatureKey,
    });
    if (!isValid) {
      console.error("[Webhook] Invalid signature for order:", orderId);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.orderId, orderId));

    if (!transaction) {
      console.error("[Webhook] Transaction not found:", orderId);
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const paymentSuccess = isPaymentSuccessful(
      transactionStatus as MidtransTransactionStatus,
      fraudStatus,
    );
    const newStatus = deriveTransactionStatus(
      transactionStatus,
      paymentSuccess,
    );

    await db
      .update(transactions)
      .set({
        status: newStatus,
        paymentType,
        paidAt: paymentSuccess ? new Date() : null,
      })
      .where(eq(transactions.orderId, orderId));

    if (!paymentSuccess) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const [user] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, transaction.userId));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await fulfillPayment(
      transaction.userId,
      transaction.packageId,
      transaction.credits,
    );

    revalidateTag("billing", "max");
    revalidateTag("dashboard", "max");

    const packageName = resolvePackageName(transaction.packageId);

    await sendPaymentConfirmationEmail({
      to: user.email,
      name: user.name,
      packageName,
      credits: transaction.credits ?? undefined,
      amount: transaction.amount,
      orderId: transaction.orderId,
    }).catch((err) => {
      console.error("[Webhook] Failed to send confirmation email:", err);
    });

    return NextResponse.json(
      { received: true, status: "success" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Webhook] payment/webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
