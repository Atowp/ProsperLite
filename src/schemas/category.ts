import { requiredString, validName } from "@/schemas/common";
import { z } from "zod";

const name = "Category name";

export const CategorySchema = z.object({
  name: validName(name, requiredString(name)).max(
    20,
    `${name} at most 20 characters.`
  ),
  iconKey: requiredString("Icon key"),
});
