// @ts-ignore — midtrans-client does not have perfect types
import crypto from "crypto";

import MidtransClient from "midtrans-client";

import { env } from "@/config/env";
import { resilientFetch } from "@/lib/http/resilient-fetch";
import type { ActionResult } from "@/types/action-result";

import type {
  CreateTransactionParams,
  PaymentClient,
  SignatureVerificationParams,
  SnapTransactionResult,
  TransactionStatus,
} from "./types";

const isProduction = env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new MidtransClient.Snap({
  isProduction,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
});

export const coreApi = new MidtransClient.CoreApi({
  isProduction,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
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

// ─── Snap Transaction (legacy export for backward compatibility) ──────────────

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
      finish: `${env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    },
  };

  return snap.createTransaction(parameter);
}

// ─── Webhook Verification (legacy export for backward compatibility) ──────────

export function verifyMidtransSignature(
  params: SignatureVerificationParams,
): boolean {
  const { orderId, statusCode, grossAmount, receivedSignature } = params;
  const serverKey = env.MIDTRANS_SERVER_KEY;
  const input = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(input)
    .digest("hex");

  return expectedSignature === receivedSignature;
}

export type MidtransTransactionStatus = TransactionStatus;

export function isPaymentSuccessful(
  transactionStatus: MidtransTransactionStatus,
  fraudStatus?: string,
): boolean {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept";
  }
  return transactionStatus === "settlement";
}

// ─── PaymentClient Implementation ────────────────────────────────────────────

function getMidtransBaseUrl(): string {
  return isProduction
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";
}

function buildAuthHeader(): string {
  return `Basic ${Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`;
}

/**
 * Creates a PaymentClient backed by Midtrans.
 * Uses resilientFetch for external HTTP calls with retry/backoff.
 */
export function createMidtransClient(): PaymentClient {
  return {
    async createTransaction(
      params: CreateTransactionParams,
    ): Promise<ActionResult<SnapTransactionResult>> {
      const baseUrl = getMidtransBaseUrl();
      const url = `${baseUrl}/snap/v1/transactions`;

      const payload = {
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
          finish: `${env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        },
      };

      const result = await resilientFetch<{
        token: string;
        redirect_url: string;
      }>(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: buildAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: {
          token: result.data.token,
          redirectUrl: result.data.redirect_url,
        },
      };
    },

    verifySignature(
      params: SignatureVerificationParams,
    ): boolean {
      return verifyMidtransSignature(params);
    },

    isPaymentSuccessful(
      transactionStatus: TransactionStatus,
      fraudStatus?: string,
    ): boolean {
      if (transactionStatus === "capture") {
        return fraudStatus === "accept";
      }
      return transactionStatus === "settlement";
    },
  };
}
