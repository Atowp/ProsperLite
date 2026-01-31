import type { CategorySlice } from "@/features/categories/store";
import type { LedgerSlice } from "@/features/ledgers/store";
import type { TransactionSlice } from "@/features/transactions/store";

export type StoreState = TransactionSlice & CategorySlice & LedgerSlice;
