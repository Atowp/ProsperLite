import { requiredString, validName } from "@/schemas/common";
import { z } from "zod";

const NAME_LABEL = "Category name";

export const CategorySchema = z.object({
  id: z.nanoid({ message: "unvalid category id" }),
  name: validName(NAME_LABEL, requiredString(NAME_LABEL)).max(
    20,
    `${NAME_LABEL} at most 20 characters.`
  ),
  iconKey: requiredString("Icon key"),
  createdAt: z.number().default(() => Date.now()),
  isSystem: z.boolean().default(false),
});

// type inference
export type Category = z.infer<typeof CategorySchema>;

// schema derive
export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  isSystem: true,
});

export type CategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type CategoryUpdateInput = z.infer<typeof UpdateCategorySchema>;
