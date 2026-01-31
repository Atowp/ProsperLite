import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTransactionSlice } from "@/features/transactions/store";
import { createLedgerSlice } from "@/features/ledgers/store";
import { createCategorySlice } from "@/features/categories/store";
import type { StoreState } from "./types";

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
