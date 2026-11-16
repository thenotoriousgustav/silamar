import "server-only";

import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/db";
import { transactions } from "@/db/schema";

import type { TransactionDTO } from "./types/transaction-dto";

/**
 * Fetches all transactions for a user, ordered by most recent.
 * Uses unstable_cache with 60s revalidation since transaction history
 * changes infrequently (only on payment events).
 * Wrapped in React cache() for request-level deduplication.
 */
export const getTransactionsByUserId = cache(
  async (userId: string): Promise<TransactionDTO[]> => {
    return getCachedTransactions(userId);
  },
);

const getCachedTransactions = unstable_cache(
  async (userId: string): Promise<TransactionDTO[]> => {
    const rows = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        status: transactions.status,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));

    return rows.map((row) => ({
      id: row.id,
      amount: row.amount,
      status: row.status,
      createdAt: row.createdAt,
    }));
  },
  ["transactions-by-user"],
  { revalidate: 60, tags: ["billing"] },
);

/**
 * Fetches a single transaction by ID, ensuring ownership.
 * Wrapped in React cache() for request-level deduplication.
 */
export const getTransactionById = cache(
  async (
    transactionId: string,
    userId: string,
  ): Promise<TransactionDTO | null> => {
    const rows = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        status: transactions.status,
        createdAt: transactions.createdAt,
        userId: transactions.userId,
      })
      .from(transactions)
      .where(eq(transactions.id, transactionId))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    if (row.userId !== userId) return null;

    return {
      id: row.id,
      amount: row.amount,
      status: row.status,
      createdAt: row.createdAt,
    };
  },
);
