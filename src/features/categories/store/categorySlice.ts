import type { ActionResponse } from "@/types";
import type { StateCreator } from "zustand";
import type { StoreState } from "@/store/types";
import { DEFAULT_CATEGORIES, DEFAULT_CATEGORY_ID } from "../constants";
import { nanoid } from "nanoid";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  type Category,
  type CategoryInput,
} from "@/schemas/category";

export interface CategorySlice {
  categories: Category[];

  addCategory: (category: CategoryInput) => ActionResponse;
  updateCategory: (id: string, category: CategoryInput) => ActionResponse;
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
    const result = CreateCategorySchema.safeParse(category);
    if (!result.success)
      return { success: false, message: result.error.message };

    if (get().categories.some((c: Category) => c.name === category.name)) {
      return { success: false, message: "Category name already exists." };
    }

    const newCategory: Category = {
      ...category,
      id: nanoid(),
      createdAt: Date.now(),
      isSystem: false,
    };
    set((state: StoreState) => ({
      categories: [...state.categories, newCategory],
    }));
    return { success: true };
  },

  updateCategory: (id, updates) => {
    // Validate the updates using UpdateCategorySchema (partial)
    const result = UpdateCategorySchema.safeParse(updates);
    if (!result.success)
      return { success: false, message: result.error.message };

    // Check name uniqueness if name is being updated
    if (updates.name) {
      if (
        get().categories.some(
          (category: Category) =>
            category.name === updates.name && category.id !== id
        )
      ) {
        return { success: false, message: "Category name already exists." };
      }
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
      transactions: state.transactions.map((transaction) =>
        transaction.categoryId === id
          ? { ...transaction, categoryId: DEFAULT_CATEGORY_ID }
          : transaction
      ),
    }));

    return { success: true, message: "Category deleted successfully." };
  },
});
