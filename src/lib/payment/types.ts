import type { ActionResult } from "@/types/action-result";

// ─── Payment Client Interface ─────────────────────────────────────────────────

export interface CreateTransactionParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  itemName: string;
  itemId: string;
  quantity: number;
}

export interface SnapTransactionResult {
  token: string;
  redirectUrl: string;
}

export type TransactionStatus =
  | "capture"
  | "settlement"
  | "pending"
  | "deny"
  | "cancel"
  | "expire"
  | "refund";

export interface SignatureVerificationParams {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  receivedSignature: string;
}

export interface PaymentClient {
  /**
   * Creates a payment transaction and returns a token + redirect URL
   * for the payment gateway checkout page.
   */
  createTransaction(
    params: CreateTransactionParams,
  ): Promise<ActionResult<SnapTransactionResult>>;

  /**
   * Verifies the authenticity of a webhook notification signature.
   * Returns true if the signature is valid.
   */
  verifySignature(params: SignatureVerificationParams): boolean;

  /**
   * Determines if a transaction status indicates successful payment.
   */
  isPaymentSuccessful(
    transactionStatus: TransactionStatus,
    fraudStatus?: string,
  ): boolean;
}
