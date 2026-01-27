import type { ActionResponse, Category } from "@/types";
import type { StateCreator } from "zustand";
import type { StoreState } from "../useStore";
import { DEFAULT_CATEGORIES } from "../constants";
import { generateId } from "../helpers";

export interface CategorySlice {
  categories: Category[];

  addCategory: (category: Omit<Category, "id" | "createdAt">) => ActionResponse;
  updateCategory: (id: string, category: Partial<Category>) => ActionResponse;
  deleteCategory: (id: string) => ActionResponse;
}

export const createCategorySlice: StateCreator<
  StoreState,
  [["zustand/persist", unknown]],
  [],
  CategorySlice
> = (set, get) => ({
  categories: DEFAULT_CATEGORIES,

  addCategory: (category) => {
    const name = category.name.trim();
    if (!name) return { success: false, message: "Category name is required." };
    if (get().categories.some((c) => c.name === category.name)) {
      return { success: false, message: "Category name already exists." };
    }
    const newCategory: Category = {
      ...category,
      id: generateId(),
      createdAt: Date.now(),
    };
    set((state) => ({ categories: [...state.categories, newCategory] }));
    return { success: true };
  },

  updateCategory: (id, updates) => {
    const name = updates.name && updates.name.trim();
    if (!name) return { success: false, message: "Category name is required." };
    if (get().categories.some((c) => c.name === updates.name && c.id !== id)) {
      return { success: false, message: "Category name already exists." };
    }
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      ),
    }));
    return { success: true };
  },

  deleteCategory: (id) => {
    const categories = get().categories;
    const target = categories.find((c) => c.id === id);
    if (target?.isSystem) {
      return { success: false, message: "System category cannot be deleted." };
    }

    /** find a system category to fallback */
    const fallbackCategory = categories.find((c) => c.isSystem);
    const fallbackId = fallbackCategory?.id || "";

    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
      /** update transactions with the fallback category */
      transactions: state.transactions.map((transaction) =>
        transaction.categoryId === id
          ? { ...transaction, categoryId: fallbackId }
          : transaction
      ),
    }));

    return { success: true };
  },
});
