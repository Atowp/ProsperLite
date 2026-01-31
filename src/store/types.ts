import type { CategorySlice } from "@/features/categories";
import type { LedgerSlice } from "@/features/ledgers";
import type { TransactionSlice } from "@/features/transactions";

export type StoreState = TransactionSlice & CategorySlice & LedgerSlice;
