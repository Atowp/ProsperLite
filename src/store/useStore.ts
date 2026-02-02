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
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Migrate from version 0 or 1 to 2
        if (version < 2) {
          // Add iconKey to existing categories
          if (persistedState.categories) {
            persistedState.categories = persistedState.categories.map((cat: any) => ({
              ...cat,
              iconKey: cat.iconKey || "smile",
            }));
          }
        }
        return persistedState as StoreState;
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);
