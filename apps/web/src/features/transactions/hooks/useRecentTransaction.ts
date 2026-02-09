/**
 * useRecentTransaction Hook
 *
 * Retrieves the most recently used categoryId and ledgerId
 * to pre-fill the quick add form with intelligent defaults.
 *
 * Strategy:
 * 1. Get the most recent transaction
 * 2. Extract its categoryId and ledgerId
 * 3. Fall back to first available category/ledger if no transactions exist
 */

import { useStore } from "@/store/useStore";
import { useMemo } from "react";

export function useRecentTransaction() {
  const { transactions, categories, ledgers } = useStore();

  return useMemo(() => {
    // Default to first available if no transactions
    const defaultCategoryId = categories[0]?.id || "";
    const defaultLedgerId = ledgers[0]?.id || "";

    if (transactions.length === 0) {
      return {
        categoryId: defaultCategoryId,
        ledgerId: defaultLedgerId,
      };
    }

    // Get most recent transaction (sorted by createdAt)
    const mostRecent = transactions.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest
    );

    return {
      categoryId: mostRecent.categoryId || defaultCategoryId,
      ledgerId: mostRecent.ledgerId || defaultLedgerId,
    };
  }, [transactions, categories, ledgers]);
}
