import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, transactions } from "@/db/schema";
import {
  verifyMidtransSignature,
  isPaymentSuccessful,
  PRO_SUBSCRIPTION,
  type MidtransTransactionStatus,
} from "@/lib/payment/midtrans";
import { sendPaymentConfirmationEmail } from "@/lib/email/resend";
import { getCreditPackage } from "@/lib/payment/midtrans";
import { eq, sql } from "drizzle-orm";

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

    // 1. Verify Midtrans signature
    const isValid = verifyMidtransSignature(
      orderId,
      statusCode,
      grossAmount,
      signatureKey,
    );

    if (!isValid) {
      console.error("[Webhook] Invalid signature for order:", orderId);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Find transaction in database
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

    // 3. Determine payment success
    const paymentSuccess = isPaymentSuccessful(
      transactionStatus as MidtransTransactionStatus,
      fraudStatus,
    );

    // 4. Determine new status
    const newStatus = (() => {
      if (paymentSuccess) return "success";
      if (["cancel", "expire"].includes(transactionStatus)) return "expired";
      if (transactionStatus === "deny") return "failed";
      return "pending";
    })() as "success" | "pending" | "failed" | "expired";

    // Update transaction status
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

    // 5. Add credits or activate Pro plan
    const [user] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, transaction.userId));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (transaction.packageId === PRO_SUBSCRIPTION.id) {
      // Activate Pro subscription
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + PRO_SUBSCRIPTION.duration);

      await db
        .update(users)
        .set({ plan: "pro", planExpiresAt: expiresAt })
        .where(eq(users.id, transaction.userId));
    } else if (transaction.credits) {
      // Add credits to user account
      await db
        .update(users)
        .set({ credits: sql`${users.credits} + ${transaction.credits}` })
        .where(eq(users.id, transaction.userId));
    }

    // 6. Send confirmation email
    const pkg = transaction.packageId
      ? getCreditPackage(transaction.packageId)
      : null;
    const packageName =
      transaction.packageId === PRO_SUBSCRIPTION.id
        ? PRO_SUBSCRIPTION.name
        : (pkg?.name ?? "Paket SiLamar");

    await sendPaymentConfirmationEmail({
      to: user.email,
      name: user.name,
      packageName,
      credits: transaction.credits ?? undefined,
      amount: transaction.amount,
      orderId: transaction.orderId,
    }).catch((err) => {
      // Don't fail the webhook if email fails
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
