import type { ActionResponse } from "@/types";
import type { StateCreator } from "zustand";
import type { StoreState } from "@/store/types";
import { DEFAULT_LEDGER, DEFAULT_LEDGER_ID } from "../constants";
import { nanoid } from "nanoid";
import {
  CreateLedgerSchema,
  UpdateLedgerSchema,
  type Ledger,
  type LedgerInput,
} from "@/schemas/ledger";

export interface LedgerSlice {
  ledgers: Ledger[];
  currentLedgerId: string;

  addLedger: (ledger: LedgerInput) => ActionResponse;
  updateLedger: (id: string, ledger: LedgerInput) => ActionResponse;
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
    const result = CreateLedgerSchema.safeParse(ledger);
    if (!result.success)
      return { success: false, message: result.error.message };

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
    // Validate the updates using UpdateLedgerSchema (partial)
    const result = UpdateLedgerSchema.safeParse(updates);
    if (!result.success)
      return { success: false, message: result.error.message };

    // Check name uniqueness if name is being updated
    if (updates.name) {
      if (
        get().ledgers.some(
          (ledger: Ledger) => ledger.name === updates.name && ledger.id !== id
        )
      ) {
        return { success: false, message: "Ledger name already exists." };
      }
    }

    // Validate balance: cannot be set to negative directly
    // Get current ledger to check original balance
    if (updates.balance !== undefined) {
      const currentLedger = get().ledgers.find((l: Ledger) => l.id === id);
      // Only reject if the new value is different from current AND is negative
      if (
        currentLedger &&
        updates.balance !== currentLedger.balance &&
        updates.balance < 0
      ) {
        return { success: false, message: "Balance cannot be negative." };
      }
    }

    set((state: StoreState) => ({
      ledgers: state.ledgers.map((ledger: Ledger) =>
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

    if (
      transactions.some((transaction) => transaction.ledgerId === id)
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
          ? { ...ledger, balance: (ledger.balance ?? 0) + amount }
          : ledger
      ),
    }));
  },

  getTotalBalance: (ledgerId) => {
    if (!ledgerId) {
      return get().ledgers.reduce(
        (sum: number, l: Ledger) => sum + (l.balance ?? 0),
        0
      );
    }
    const ledger = get().ledgers.find(
      (ledger: Ledger) => ledger.id === ledgerId
    );
    return ledger ? ledger.balance ?? 0 : 0;
  },
});
