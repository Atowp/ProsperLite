import { requiredString, validName } from "@/schemas/common";
import { z } from "zod";

const name = "Category name";

export const CategorySchema = z.object({
  name: requiredString(name, validName(name)).max(
    6,
    `${name} at most 6 characters.`
  ),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, "Invalid color format"), // Hex
});
