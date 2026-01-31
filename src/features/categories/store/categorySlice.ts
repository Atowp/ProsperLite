import type { ActionResponse } from "@/types";
import type { StateCreator } from "zustand";
import type { StoreState } from "@/store/types";
import { DEFAULT_CATEGORIES, DEFAULT_CATEGORY_ID } from "../constants";
import type { Category } from "../types";
import { nanoid } from "nanoid";
import { CategorySchema } from "@/schemas/category";
import type { Transaction } from "@/features/transactions/types";

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
    const result = CategorySchema.safeParse(category);
    if (!result.success)
      return { success: false, message: result.error.message };

    if (get().categories.some((c: Category) => c.name === category.name)) {
      return { success: false, message: "Category name already exists." };
    }

    const newCategory: Category = {
      ...category,
      id: nanoid(),
      createdAt: Date.now(),
    };
    set((state: StoreState) => ({
      categories: [...state.categories, newCategory],
    }));
    return { success: true };
  },

  updateCategory: (id, updates) => {
    const result = CategorySchema.safeParse(updates.name);
    if (!result.success)
      return { success: false, message: result.error.message };

    if (
      get().categories.some(
        (category: Category) =>
          category.name === updates.name && category.id !== id
      )
    ) {
      return { success: false, message: "Category name already exists." };
    }

    set((state: StoreState) => ({
      categories: state.categories.map((category: Category) =>
        category.id === id ? { ...category, ...updates } : category
      ),
    }));
    return { success: true };
  },

  deleteCategory: (id) => {
    if (id === DEFAULT_CATEGORY_ID) {
      return { success: false, message: "System category cannot be deleted." };
    }

    set((state: StoreState) => ({
      categories: state.categories.filter(
        (category: Category) => category.id !== id
      ),
      /** update transactions with the system category */
      transactions: state.transactions.map((transaction: Transaction) =>
        transaction.categoryId === id
          ? { ...transaction, categoryId: DEFAULT_CATEGORY_ID }
          : transaction
      ),
    }));

    return { success: true, message: "Category deleted successfully." };
  },
});
