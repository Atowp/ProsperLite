import type { ActionResponse } from "@/types";
import type { StateCreator } from "zustand";
import type { StoreState } from "@/store/types";
import { toNum } from "@/store/helpers";
import type { Transaction, TransactionInput } from "@/schemas/transaction";
import { nanoid } from "nanoid";

export interface TransactionSlice {
  transactions: Transaction[];

  addTransaction: (transaction: TransactionInput) => ActionResponse;
  updateTransaction: (id: string, transaction: TransactionInput) => ActionResponse;
  deleteTransaction: (id: string) => ActionResponse;

  getTransactionsByDateRange: (
    startDate: string,
    endDate: string
  ) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
}

/** calculate the impact of a transaction on the ledger */
const calculateImpact = (transaction: Transaction) =>
  transaction.type === "income" ? transaction.amount : -transaction.amount;

export const createTransactionSlice: StateCreator<
  StoreState,
  [["zustand/immer", unknown], ["zustand/persist", unknown]],
  [],
  TransactionSlice
> = (set, get) => {
  /** handle side effect of transaction on ledger balance */
  const syncBalanceEffect = (
    oldTx: Transaction | null,
    newTx: Transaction | null
  ) => {
    /** subtract old effects */
    if (oldTx) get().adjustBalance(oldTx.ledgerId, -calculateImpact(oldTx));
    /** add new effects */
    if (newTx) get().adjustBalance(newTx.ledgerId, calculateImpact(newTx));
  };

  return {
    transactions: [],

    addTransaction: (transaction) => {
      const newTx: Transaction = {
        ...transaction,
        id: nanoid(),
        createdAt: Date.now(),
      };
      set((state) => {
        // With immer, we can directly mutate the draft
        state.transactions.unshift(newTx);
      });

      syncBalanceEffect(null, newTx);
      return { success: true };
    },

    updateTransaction: (id, updates) => {
      const oldTx = get().transactions.find(
        (transaction) => transaction.id === id
      );
      if (!oldTx) return { success: false, message: "Transaction not found" };

      const newTx = { ...oldTx, ...updates };

      set((state) => {
        // With immer, we can directly mutate the draft
        const index = state.transactions.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.transactions[index] = newTx;
        }
      });

      syncBalanceEffect(oldTx, newTx);
      return { success: true };
    },

    deleteTransaction: (id) => {
      const oldTx = get().transactions.find(
        (transaction) => transaction.id === id
      );
      if (!oldTx) return { success: false, message: "Transaction not found" };

      set((state) => {
        // With immer, we can directly mutate the draft
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== id
        );
      });

      syncBalanceEffect(oldTx, null);
      return { success: true };
    },

    getTransactionsByDateRange: (startDate, endDate) => {
      const start = toNum(startDate);
      const end = toNum(endDate);

      return get().transactions.filter((transaction) => {
        const date = toNum(transaction.date);
        return date >= start && date <= end;
      });
    },

    getTransactionsByCategory: (categoryId) => {
      return get().transactions.filter(
        (transaction) => transaction.categoryId === categoryId
      );
    },
  };
};
