import { requiredString, validName } from "@/schemas/common";
import { z } from "zod";

const name = "Ledger name";

export const LedgerSchema = z.object({
  name: requiredString(name, validName(name)).max(
    10,
    `${name} at most 10 characters.`
  ),
});
