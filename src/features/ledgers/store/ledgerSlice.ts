import type { ActionResponse } from "@/types";
import type { StateCreator } from "zustand";
import type { StoreState } from "@/store/types";
import { DEFAULT_LEDGER, DEFAULT_LEDGER_ID } from "../constants";
import type { Ledger } from "../types";
import { nanoid } from "nanoid";
import type { Transaction } from "@/features/transactions/types";
import { LedgerSchema } from "@/schemas/ledger";

export interface LedgerSlice {
  ledgers: Ledger[];
  currentLedgerId: string;

  addLedger: (ledger: Omit<Ledger, "id" | "createdAt">) => ActionResponse;
  updateLedger: (id: string, ledger: Partial<Ledger>) => ActionResponse;
  deleteLedger: (id: string) => ActionResponse;

  adjustBalance: (id: string, amount: number) => void;
  getTotalBalance: (ledgerId?: string) => number;
}

export const createLedgerSlice: StateCreator<
  StoreState,
  [["zustand/persist", unknown]],
  [],
  LedgerSlice
> = (set, get) => ({
  ledgers: DEFAULT_LEDGER,
  currentLedgerId: DEFAULT_LEDGER_ID,

  addLedger: (ledger) => {
    const result = LedgerSchema.safeParse(ledger);
    if (!result.success) return { success: false, message: result.error.message };

    if (get().ledgers.some((l: Ledger) => l.name === ledger.name)) {
      return { success: false, message: "Ledger name already exists." };
    }

    const newLedger: Ledger = {
      ...ledger,
      id: nanoid(),
      createdAt: Date.now(),
    };
    set((state: StoreState) => ({ ledgers: [...state.ledgers, newLedger] }));
    return { success: true };
  },

  updateLedger: (id, updates) => {
    // Only validate if name is being updated
    if (updates.name) {
      const result = LedgerSchema.safeParse(updates);
      if (!result.success) return { success: false, message: result.error.message };

      if (
        get().ledgers.some(
          (ledger: Ledger) => ledger.name === updates.name && ledger.id !== id
        )
      ) {
        return { success: false, message: "Ledger name already exists." };
      }
    }

    if (updates.balance !== undefined && updates.balance < 0) {
      return { success: false, message: "Balance cannot be negative." };
    }

    set((state: StoreState) => ({
      ledgers: state.ledgers.map((ledger: Ledger) =>
        ledger.id === id ? { ...ledger, ...updates } : ledger
      ),
    }));
    return { success: true };
  },

  deleteLedger: (id) => {
    if (id === DEFAULT_LEDGER_ID) {
      return { success: false, message: "System ledger cannot be deleted." };
    }

    const { ledgers, transactions } = get();
    if (ledgers.length <= 1) {
      return { success: false, message: "Ledger must have at least one." };
    }

    if (
      transactions.some(
        (transaction: Transaction) => transaction.ledgerId === id
      )
    ) {
      return {
        success: false,
        message: "Ledger with transactions cannot be deleted.",
      };
    }

    const targetLedger = ledgers.find((ledger: Ledger) => ledger.id === id);
    if (targetLedger && targetLedger.balance !== 0) {
      return {
        success: false,
        message: "Ledger with non-zero balance cannot be deleted.",
      };
    }

    set((state: StoreState) => ({
      ledgers: state.ledgers.filter((ledger: Ledger) => ledger.id !== id),
    }));
    return { success: true, message: "Ledger deleted successfully." };
  },

  adjustBalance: (id, amount) => {
    set((state: StoreState) => ({
      ledgers: state.ledgers.map((ledger: Ledger) =>
        ledger.id === id
          ? { ...ledger, balance: ledger.balance + amount }
          : ledger
      ),
    }));
  },

  getTotalBalance: (ledgerId) => {
    if (!ledgerId) {
      return get().ledgers.reduce(
        (sum: number, l: Ledger) => sum + l.balance,
        0
      );
    }
    const ledger = get().ledgers.find(
      (ledger: Ledger) => ledger.id === ledgerId
    );
    return ledger ? ledger.balance : 0;
  },
});
