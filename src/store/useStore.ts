import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createTransactionSlice,
  type TransactionSlice,
} from "./slices/transactionSlice";
import { createLedgerSlice, type LedgerSlice } from "./slices/ledgerSlice";
import {
  createCategorySlice,
  type CategorySlice,
} from "./slices/categorySlice";

export type StoreState = TransactionSlice & CategorySlice & LedgerSlice;

export const useStore = create<StoreState>()(
  persist(
    (...r) => ({
      /** combines the slices */
      ...createTransactionSlice(...r),
      ...createCategorySlice(...r),
      ...createLedgerSlice(...r),
    }),
    {
      name: "prosperlite-storage",
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
        ledgers: state.ledgers,
      }),
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
