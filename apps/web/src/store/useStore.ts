import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createTransactionSlice } from "@/features/transactions/store";
import { createLedgerSlice } from "@/features/ledgers/store";
import { createCategorySlice } from "@/features/categories/store";
import { createSettingSlice } from "@/features/settings/store";
import type { StoreState } from "./types";

/**
 * Type guard to check if a value is a valid array
 */
function isValidArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if a value is a valid object
 */
function isValidObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is a valid category
 */
function isValidCategory(value: unknown): value is Record<string, unknown> & {
  id?: string;
  name?: string;
  iconKey?: string;
} {
  return (
    isValidObject(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string"
  );
}

/**
 * Migration function with proper type guards
 */
function migrateState(persistedState: unknown, version: number): StoreState {
  if (!isValidObject(persistedState)) {
    throw new Error("Invalid persisted state: expected an object");
  }

  // Migrate from version 0 or 1 to 2
  if (version < 2) {
    // Add iconKey to existing categories
    const categories = persistedState.categories;
    if (isValidArray(categories)) {
      persistedState.categories = categories.map((cat) => {
        if (isValidCategory(cat)) {
          return {
            ...cat,
            iconKey: cat.iconKey || "smile",
          };
        }
        return cat;
      });
    }
  }

  // Return the migrated state with proper type assertion
  // We've validated the structure, so this is safe
  return persistedState as unknown as StoreState;
}

export const useStore = create<StoreState>()(
  subscribeWithSelector(
    immer(
      persist(
        (...r) => ({
          /** combines the slices */
          ...createTransactionSlice(...r),
          ...createCategorySlice(...r),
          ...createLedgerSlice(...r),
          ...createSettingSlice(...r),
        }),
        {
          name: "prosperlite-storage",
          partialize: (state) => ({
            transactions: state.transactions,
            categories: state.categories,
            ledgers: state.ledgers,
            monthlyLimit: state.monthlyLimit,
            // Don't persist pagination and filter states
            // They reset to defaults on each page load
          }),
          version: 4,
          migrate: (persistedState, version) => {
            const state = migrateState(persistedState, version);
            // Migrate from version 2 to 3: add monthlyLimit if missing
            if (typeof state.monthlyLimit !== "number") {
              state.monthlyLimit = 5000;
            }
            // Version 4: Pagination and filter states no longer persisted
            // They will reset to defaults (page 1, no date filter)
            return state;
          },
          storage: createJSONStorage(() => localStorage),
          onRehydrateStorage: () => {
            // Return callback for when rehydration completes
            return (state, error) => {
              if (error) {
                console.error("Error rehydrating store:", error);
              } else if (state) {
                console.log("Store rehydrated successfully");
                // You can dispatch actions or set loading state here
              }
            };
          },
        }
      )
    )
  )
);
