// @ts-ignore — midtrans-client does not have perfect types
import MidtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new MidtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export const coreApi = new MidtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// ─── Credit Packages ──────────────────────────────────────────────────────────

export const CREDIT_PACKAGES = [
  { id: "starter", name: "Starter Pack", credits: 5, price: 15000 },
  { id: "standard", name: "Standard Pack", credits: 15, price: 35000 },
  { id: "pro_pack", name: "Pro Pack", credits: 30, price: 60000 },
] as const;

export const PRO_SUBSCRIPTION = {
  id: "pro_monthly",
  name: "Pro Monthly",
  price: 99000,
  duration: 30, // days
} as const;

export type CreditPackageId = (typeof CREDIT_PACKAGES)[number]["id"];

export function getCreditPackage(id: string) {
  return CREDIT_PACKAGES.find((pkg) => pkg.id === id) ?? null;
}

// ─── Snap Transaction ─────────────────────────────────────────────────────────

interface CreateSnapTransactionParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  itemName: string;
  itemId: string;
  quantity: number;
}

export async function createSnapTransaction(
  params: CreateSnapTransactionParams,
): Promise<{ token: string; redirect_url: string }> {
  const parameter = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
    },
    item_details: [
      {
        id: params.itemId,
        price: params.amount,
        quantity: params.quantity,
        name: params.itemName,
      },
    ],
    credit_card: {
      secure: true,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    },
  };

  return snap.createTransaction(parameter);
}

// ─── Webhook Verification ─────────────────────────────────────────────────────

import crypto from "crypto";

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  receivedSignature: string,
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const input = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(input)
    .digest("hex");

  return expectedSignature === receivedSignature;
}

export type MidtransTransactionStatus =
  | "capture"
  | "settlement"
  | "pending"
  | "deny"
  | "cancel"
  | "expire"
  | "refund";

export function isPaymentSuccessful(
  transactionStatus: MidtransTransactionStatus,
  fraudStatus?: string,
): boolean {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept";
  }
  return transactionStatus === "settlement";
}
