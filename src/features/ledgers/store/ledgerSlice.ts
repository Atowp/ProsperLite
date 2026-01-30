import type { ActionResponse } from "@/types";
import type { StateCreator } from "zustand";
import type { StoreState } from "@/store/useStore";
import { DEFAULT_LEDGER } from "../constants";
import type { Ledger } from "../types";
import { nanoid } from "nanoid";

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
  currentLedgerId: DEFAULT_LEDGER[0].id,

  addLedger: (ledger) => {
    const name = ledger.name.trim();
    if (!name) return { success: false, message: "Ledger name is required." };

    if (get().ledgers.some((l) => l.name === ledger.name)) {
      return { success: false, message: "Ledger name already exists." };
    }

    const newLedger: Ledger = {
      ...ledger,
      id: nanoid(),
      createdAt: Date.now(),
    };
    set((state) => ({ ledgers: [...state.ledgers, newLedger] }));
    return { success: true };
  },

  updateLedger: (id, updates) => {
    const name = updates.name && updates.name.trim();
    if (!name) return { success: false, message: "Ledger name is required." };

    if (get().ledgers.some((l) => l.name === updates.name && l.id !== id)) {
      return { success: false, message: "Ledger name already exists." };
    }

    if (updates.balance && updates.balance < 0) {
      return { success: false, message: "Balance cannot be negative." };
    }

    set((state) => ({
      ledgers: state.ledgers.map((ledger) =>
        ledger.id === id ? { ...ledger, ...updates } : ledger
      ),
    }));
    return { success: true };
  },

  deleteLedger: (id) => {
    const { ledgers, transactions } = get();
    if (ledgers.length <= 1) {
      return { success: false, message: "Ledger must have at least one." };
    }

    if (transactions.some((transaction) => transaction.ledgerId === id)) {
      return {
        success: false,
        message: "Ledger with transactions cannot be deleted.",
      };
    }

    const targetLedger = ledgers.find((ledger) => ledger.id === id);
    if (targetLedger && targetLedger.balance !== 0) {
      return {
        success: false,
        message: "Ledger with non-zero balance cannot be deleted.",
      };
    }

    set((state) => ({
      ledgers: state.ledgers.filter((ledger) => ledger.id !== id),
    }));
    return { success: true };
  },

  adjustBalance: (id, amount) => {
    set((state) => ({
      ledgers: state.ledgers.map((ledger) =>
        ledger.id === id
          ? { ...ledger, balance: ledger.balance + amount }
          : ledger
      ),
    }));
  },

  getTotalBalance: (ledgerId) => {
    if (!ledgerId) {
      return get().ledgers.reduce((sum, l) => sum + l.balance, 0);
    }
    const ledger = get().ledgers.find((ledger) => ledger.id === ledgerId);
    return ledger ? ledger.balance : 0;
  },
});
