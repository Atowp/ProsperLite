import type { StateCreator } from "zustand";
import type { StoreState } from "@/store/types";
import type { MonthlyLimitInput } from "@/schemas";

export interface SettingSlice {
  monthlyLimit: number;
  setMonthlyLimit: (limit: number) => void;
  updateMonthlyLimit: (data: MonthlyLimitInput) => void;
}

export const DEFAULT_MONTHLY_LIMIT = 5000;

export const createSettingSlice: StateCreator<
  StoreState,
  [["zustand/immer", unknown], ["zustand/persist", unknown]],
  [],
  SettingSlice
> = (set) => ({
  monthlyLimit: DEFAULT_MONTHLY_LIMIT,

  setMonthlyLimit: (limit) => {
    set((state: StoreState) => {
      state.monthlyLimit = limit;
    });
  },

  updateMonthlyLimit: (data) => {
    set((state: StoreState) => {
      state.monthlyLimit = data.amount;
    });
  },
});
