import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, transactions } from "@/lib/db/schema";
import {
  createSnapTransaction,
  getCreditPackage,
  PRO_SUBSCRIPTION,
} from "@/lib/payment/midtrans";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const requestSchema = z.object({
  packageId: z.string(),
  type: z.enum(["credit", "subscription"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Input tidak valid", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [user] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, session.user.id));

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    let amount: number;
    let credits: number | undefined;
    let itemName: string;

    if (parsed.data.type === "credit") {
      const pkg = getCreditPackage(parsed.data.packageId);
      if (!pkg) {
        return NextResponse.json(
          { error: "Paket tidak ditemukan" },
          { status: 404 }
        );
      }
      amount = pkg.price;
      credits = pkg.credits;
      itemName = pkg.name;
    } else {
      if (parsed.data.packageId !== PRO_SUBSCRIPTION.id) {
        return NextResponse.json(
          { error: "Paket subscription tidak ditemukan" },
          { status: 404 }
        );
      }
      amount = PRO_SUBSCRIPTION.price;
      credits = undefined;
      itemName = PRO_SUBSCRIPTION.name;
    }

    const orderId = `SILAMAR-${randomUUID().slice(0, 8).toUpperCase()}`;

    // Create pending transaction record
    await db.insert(transactions).values({
      id: randomUUID(),
      userId: session.user.id,
      orderId,
      amount,
      credits: credits ?? null,
      status: "pending",
      packageId: parsed.data.packageId,
    });

    // Create Midtrans Snap transaction
    const snapResult = await createSnapTransaction({
      orderId,
      amount,
      customerName: user.name,
      customerEmail: user.email,
      itemName,
      itemId: parsed.data.packageId,
      quantity: 1,
    });

    // Update transaction with midtrans token
    await db
      .update(transactions)
      .set({
        midtransToken: snapResult.token,
        midtransRedirectUrl: snapResult.redirect_url,
      })
      .where(eq(transactions.orderId, orderId));

    return NextResponse.json(
      {
        success: true,
        snapToken: snapResult.token,
        orderId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] payment/create error:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi" },
      { status: 500 }
    );
  }
}
