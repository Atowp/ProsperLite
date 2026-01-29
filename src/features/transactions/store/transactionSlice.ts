import type { ActionResponse } from "@/types";
import type { StateCreator } from "zustand";
import type { StoreState } from "@store/useStore";
import { generateId, toNum } from "@store/helpers";
import type { Transaction } from "../types";

export interface TransactionSlice {
  transactions: Transaction[];

  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt">
  ) => ActionResponse;
  updateTransaction: (
    id: string,
    transaction: Partial<Transaction>
  ) => ActionResponse;
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
  [["zustand/persist", unknown]],
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
        id: generateId(),
        createdAt: Date.now(),
      } as Transaction;
      set((state) => ({ transactions: [newTx, ...state.transactions] }));

      syncBalanceEffect(null, newTx);
      return { success: true };
    },

    updateTransaction: (id, updates) => {
      const oldTx = get().transactions.find((t) => t.id === id);
      if (!oldTx) return { success: false, message: "Transaction not found" };
      const newTx = { ...oldTx, ...updates };
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id ? newTx : transaction
        ),
      }));

      syncBalanceEffect(oldTx, newTx);
      return { success: true };
    },

    deleteTransaction: (id) => {
      const oldTx = get().transactions.find((t) => t.id === id);
      if (!oldTx) return { success: false, message: "Transaction not found" };
      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== id
        ),
      }));

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
