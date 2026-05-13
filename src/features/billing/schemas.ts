import { z } from "zod";

export const createTransactionSchema = z.object({
  packageId: z.string().min(1, "Package ID is required"),
  type: z.enum(["credit", "subscription"], {
    message: "Type must be 'credit' or 'subscription'",
  }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
