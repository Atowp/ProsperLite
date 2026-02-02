import type { LedgerSchema } from "@/schemas";
import type z from "zod";

export interface Ledger {
  id: string;
  name: string;
  balance: number;
  createdAt: number;
  isSystem?: boolean;
}

export type LedgerInput = z.infer<typeof LedgerSchema>;

export type LedgerUpdateInput = Partial<LedgerInput> & { balance?: number };
