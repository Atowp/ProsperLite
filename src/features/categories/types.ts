import type { CategorySchema } from "@/schemas";
import type z from "zod";

export interface Category {
  id: string;
  name: string;
  iconKey: string;
  createdAt: number;
  isSystem?: boolean;
}

export type CategoryInput = z.infer<typeof CategorySchema>;

export type CategoryUpdateInput = Partial<CategoryInput>;
