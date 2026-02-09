import { z } from "@prosper/shared";

export const TransactionTypeEnum = z.enum(["income", "expense"]);

export const TransactionSchema = z.object({
  id: z.nanoid({ message: "unvalid transaction id" }),

  amount: z
    .number()
    .positive({ message: "amount must be positive" })
    .max(100000000, { message: "amount must be less than 100000000" }),

  type: TransactionTypeEnum,

  categoryId: z.string().min(1, "select category"),
  ledgerId: z.string().min(1, "select ledger"),

  date: z.iso.datetime({ message: "unvalid date format" }),

  remark: z
    .string()
    .max(200, "remark must be less than 200 characters")
    .optional(),

  createdAt: z.number().default(() => Date.now()),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  createdAt: true,
});

export type TransactionInput = z.infer<typeof CreateTransactionSchema>;

export const UpdateTransactionSchema = CreateTransactionSchema.partial();
export type TransactionUpdateInput = z.infer<typeof UpdateTransactionSchema>;
