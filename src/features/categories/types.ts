export interface Category {
  id: string;
  name: string;
  iconKey: string;
  createdAt: number;
  isSystem?: boolean;
}

export type CategoryInput = Omit<Category, "id" | "createdAt" | "isSystem">;

export type CategoryUpdateInput = Partial<CategoryInput>;
