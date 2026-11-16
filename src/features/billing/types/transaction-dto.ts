export type TransactionStatus = "pending" | "success" | "failed" | "expired";

export type TransactionDTO = {
  id: string;
  amount: number;
  status: TransactionStatus;
  createdAt: Date;
};
