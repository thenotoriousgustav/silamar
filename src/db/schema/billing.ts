import { pgTable, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "success",
  "failed",
  "expired",
]);

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull().unique(),
  amount: integer("amount").notNull(),
  credits: integer("credits"),
  status: transactionStatusEnum("status").notNull().default("pending"),
  paymentType: text("payment_type"),
  midtransToken: text("midtrans_token"),
  midtransRedirectUrl: text("midtrans_redirect_url"),
  packageId: text("package_id"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
