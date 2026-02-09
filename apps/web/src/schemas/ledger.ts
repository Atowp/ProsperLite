import { requiredString, validName } from "@/schemas/common";
import { z } from "@prosper/shared";

const NAME_LABEL = "Ledger name";

// basic ledger schema
export const LedgerSchema = z.object({
  id: z.nanoid({ message: "unvalid ledger id" }),
  name: validName(NAME_LABEL, requiredString(NAME_LABEL)).max(
    20,
    `${NAME_LABEL} at most 20 characters.`
  ),
  balance: z
    .number()
    .min(0, "Balance cannot be negative")
    .multipleOf(0.01, { message: "Balance must be a multiple of 0.01" })
    .optional(),
  createdAt: z.number().default(() => Date.now()),
});

// type inference
export type Ledger = z.infer<typeof LedgerSchema>;

// schema derive
export const CreateLedgerSchema = LedgerSchema.omit({
  id: true,
  createdAt: true,
});

export type LedgerInput = z.infer<typeof CreateLedgerSchema>;

export const UpdateLedgerSchema = CreateLedgerSchema.partial();
export type UpdateLedgerInput = z.infer<typeof UpdateLedgerSchema>;
